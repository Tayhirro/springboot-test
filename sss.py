import argparse
from pathlib import Path
import shutil
import subprocess
import sys
import time
import os

CAR_NUMS = [180]
RUNS_PER_CAR = 30


def _project_root() -> Path:
    # .../OpenCDA_demo/mytest/generaldata/run_generate_config_yaml_batch_global.py
    return Path(__file__).resolve().parents[2]

def _copy_config_to_back(
    config_path: Path,
    back_dir: Path,
    *,
    scenario: str,
    car_num: int,
    seed: int,
) -> Path:
    back_dir.mkdir(parents=True, exist_ok=True)
    stem = f"{scenario}_car{car_num}_seed{seed:06d}"
    dst = back_dir / f"{stem}.yaml"
    dup = 2
    while dst.exists():
        dst = back_dir / f"{stem}_{dup}.yaml"
        dup += 1
    shutil.copy2(config_path, dst)
    return dst


def main():
    """
    从 OpenCDA_demo 根目录运行：
        python mytest/generaldata/run_generate_config_yaml_batch_global.py

    按以下规则批量调用 generate_config_yaml_long_global_plan_road.py，
    并在每次生成后运行一次场景：
      - car_num 使用 CAR_NUMS
      - 每个 car_num 运行 30 次，seed 均不同
      - 每次调用 generate_config_yaml_long_global_plan_road.py 之后，
        立刻执行：python opencda.py -t straight_road_town4

    支持断点续跑：
      - 可通过 --start-seed 指定从全局第几个 seed 开始，
        之前的组合会被跳过（不再重复运行）。
    """
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--python",
        type=str,
        default=None,
        help=(
            "用于运行子脚本的 Python 解释器路径；默认使用当前解释器（sys.executable）。"
        ),
    )
    parser.add_argument(
        "--gen-retries",
        type=int,
        default=5,
        help="generate_config_yaml_long_global_plan_road.py 失败时的重试次数（默认 5）。",
    )
    parser.add_argument(
        "--gen-retry-sleep",
        type=float,
        default=2.0,
        help="生成脚本失败后的重试等待秒数（默认 2.0）。",
    )
    parser.add_argument(
        "--start-seed",
        type=int,
        default=0,
        help="从该全局 seed 开始（跳过之前所有组合），例如 166。",
    )
    parser.add_argument(
        "-i_start",
        "--i_start",
        "--data_dump_index_start",
        dest="i_start",
        type=int,
        default=0,
        help="传给 opencda.py 的 data_dump_index_start（默认 0）。",
    )
    parser.add_argument(
        "-i_end",
        "--i_end",
        "--data_dump_index_end",
        dest="i_end",
        type=int,
        default=None,
        help="传给 opencda.py 的 data_dump_index_end；默认不填则等于 car_num（即采集全部车辆）。",
    )
    parser.add_argument(
        "--dump-root",
        dest="dump_root",
        type=str,
        default="/mnt/sda2/jhy/data_dumping_2_work",
        help=(
            "OpenCDA 数据输出根目录（等价于设置环境变量 OPENCDA_DUMP_ROOT）；"
            "脚本会自动创建该目录（默认 /mnt/sda2/jhy/data_dumping_2_work）。"
        ),
    )
    args = parser.parse_args()

    project_root = _project_root()
    scenario_name = "straight_road_town4"
    config_path = (
        project_root / "opencda" / "scenario_testing" / "config_yaml" / f"{scenario_name}.yaml"
    )
    base_config_path = (
        project_root
        / "opencda"
        / "scenario_testing"
        / "config_yaml"
        / "straight_road_town10_cars_basic.yaml"
    )
    back_dir = project_root / "opencda" / "scenario_testing" / "config_yaml" / "back"

    seed = 0
    started = False

    dump_root = Path(args.dump_root).expanduser()
    dump_root.mkdir(parents=True, exist_ok=True)
    run_env = os.environ.copy()
    run_env["OPENCDA_DUMP_ROOT"] = str(dump_root)

    py = args.python or sys.executable

    for car_num in CAR_NUMS:
        for _ in range(RUNS_PER_CAR):
            # 还没到起始 seed，直接跳过
            if not started and seed < args.start_seed:
                print(
                    f"[SKIP] car_num={car_num}, "
                    f"seed={seed} (< start_seed={args.start_seed})"
                )
                seed += 1
                continue

            started = True

            gen_cmd = [
                py,
                str(
                    project_root
                    / "mytest"
                    / "generaldata"
                    / "generate_config_yaml_long_global_plan_road.py"
                ),
                "--car_num",
                str(car_num),
                "--seed",
                str(seed),
                "--out_config_file",
                str(config_path),
                "--config_base_path",
                str(base_config_path),
            ]
            print("Running:", " ".join(gen_cmd))
            last_err = None
            for attempt in range(1, max(1, args.gen_retries) + 1):
                try:
                    subprocess.run(
                        gen_cmd,
                        check=True,
                        cwd=project_root,
                        env=run_env,
                        text=True,
                        capture_output=True,
                    )
                    last_err = None
                    break
                except subprocess.CalledProcessError as e:
                    last_err = e
                    print(
                        f"[WARN] 生成脚本失败 attempt={attempt}/{args.gen_retries} "
                        f"returncode={e.returncode}"
                    )
                    if e.stdout:
                        print("[gen stdout]\n" + e.stdout.rstrip())
                    if e.stderr:
                        print("[gen stderr]\n" + e.stderr.rstrip())
                    if attempt < args.gen_retries:
                        time.sleep(float(args.gen_retry_sleep))
            if last_err is not None:
                raise last_err

            backed = _copy_config_to_back(
                config_path,
                back_dir,
                scenario=scenario_name,
                car_num=car_num,
                seed=seed,
            )
            print(f"[BACKUP] {config_path} -> {backed}")

            i_end = car_num if args.i_end is None else args.i_end
            run_cmd = [
                py,
                str(project_root / "opencda.py"),
                "-t",
                scenario_name,
                "-i_start",
                str(args.i_start),
                "-i_end",
                str(i_end),
            ]
            print("Running:", " ".join(run_cmd))
            # 不用 check=True，这样即使单次场景异常退出也不会
            # 中断整个批量循环，而是打印提示继续下一个。
            run_proc = subprocess.run(
                run_cmd,
                cwd=project_root,
                env=run_env,
            )
            if run_proc.returncode != 0:
                print(
                    f"[WARN] opencda.py 场景运行失败，"
                    f"returncode={run_proc.returncode}，继续下一次循环。"
                )

            # 给 CARLA / OpenCDA 一点时间清理资源
            time.sleep(2.0)

            seed += 1


if __name__ == "__main__":
    main()
