package com.dong.life.test.forkjoin;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.ForkJoinPool;
import java.util.concurrent.ForkJoinTask;
import java.util.concurrent.RecursiveTask;

public class Demo {

    //分隔临界值
    static final Integer THRESHOLD = 10000;

    static class DemoTask extends RecursiveTask<Integer>{

        private List<Integer> nums;

        public DemoTask(List<Integer> nums){
            this.nums = nums;
        }

        @Override
        protected Integer compute() {
            int size = nums.size();
            if ( size <= THRESHOLD){
                int total = 0;
                for(int i=0;i<size;i++){
                    total += nums.get(i);
                }
                return total;
            }else{
                DemoTask task1 = new DemoTask(nums.subList(0,size/2));
                DemoTask task2 = new DemoTask(nums.subList(size/2,size));
                task1.fork();
                task2.fork();
                return task1.join()+task2.join();
            }
        }
    }


    public static void main(String[] args) throws ExecutionException, InterruptedException {
        List<Integer> all = new ArrayList<>();
        for(int i=0;i<1000000;i++){
            all.add(i);
        }

        long l = System.currentTimeMillis();
        ForkJoinPool forkJoinPool = new ForkJoinPool();
        ForkJoinTask<Integer> submit = forkJoinPool.submit(new DemoTask(all));
        long end = System.currentTimeMillis() - l;
        System.out.println("最终结果:"+submit.get()+",耗时："+end);

        l = System.currentTimeMillis();
        int total = 0;
        for(int i=0,size=all.size();i<size;i++){
            total += all.get(i);
        }
        end = System.currentTimeMillis() - l;
        System.out.println("普通结果:"+total+",耗时："+end);

    }

}
