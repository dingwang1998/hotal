<template>
    <div class="container">
        <el-row type="flex" justify="space-between">
            <!-- 订单表单 -->
            <OrderForm/>

            <!-- 其他代码... -->
            
        </el-row>
    </div>
</template>

<script>
import OrderForm from "@/components/air/orderForm.vue";

export default {
    components: {
        OrderForm,
    }
}
</script>