#include <vector>
#include <iostream>


class FenwickTree{
    private:
        std::vector<int> tree;
        int n; 
    public: 
        explicit FenwickTree(int size) : n(size + 1) {
            tree.resize(n, 0);
        }
        void update(int i, int delta) {
            for (; i < n; i += i & (-i)) { 
                tree[i] += delta;
            }  
        }
        int query(int m,int n ){

        }   
        explicit
}
class FenwickTree {
private:
    std::vector<int> tree;
    int n;

public:
    // 构造函数，初始化树状数组，大小为size+1（因为树状数组通常从1开始索引）
    explicit FenwickTree(int size) : n(size + 1) {
        tree.resize(n, 0);
    }

    // 更新操作：将位置i的值增加delta           
    void update(int i, int delta) {
        for (; i < n; i += i & (-i)) {
            tree[i] += delta;
        }
    }

    // 查询操作：计算从1到i的前缀和
    int query(int i) {
        int sum = 0;
        for (; i > 0; i -= i & (-i)) {
            sum += tree[i];
        }
        return sum;
    }

    // 查询区间[i, j]的和
    int query(int i, int j) {
        if (i > j) return 0;
        return query(j) - query(i - 1);
    }

    // 获取单个位置的值
    int get(int i) {
        return query(i, i);
    }
};


int 



int main() {
    // 测试树状数组
    FenwickTree ft(10); // 创建大小为10的树状数组
    
    // 初始化数组 [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    for (int i = 1; i <= 10; i++) {
        ft.update(i, i);
    }
    
    std::cout << "前缀和 [1, 5]: " << ft.query(5) << std::endl;  // 输出 1+2+3+4+5 = 15
    std::cout << "区间和 [3, 7]: " << ft.query(3, 7) << std::endl;  // 输出 3+4+5+6+7 = 25
    std::cout << "位置 4 的值: " << ft.get(4) << std::endl;  // 输出 4
    
    // 更新位置5的值，增加10
    ft.update(5, 10);
    std::cout << "更新位置5后，区间和 [3, 7]: " << ft.query(3, 7) << std::endl;  // 输出 3+4+(5+10)+6+7 = 35
    
    return 0;
}




