<template>
<!-- 其他代码... -->

    <!-- 搜索广告栏 -->
    <el-row type="flex" justify="space-between">
        <!-- 搜索表单 -->
        <SearchForm/>

        <!-- banner广告 -->
    </el-row>

<!-- 其他代码... -->
</template>
<script>
import SearchForm from "@/components/air/searchForm";

export default {
    components: {
        SearchForm
    },
}
</script>