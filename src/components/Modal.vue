<template>
  <div>
    <a-config-provider :locale="locale">
        <a-modal :title="`Копирование ${leadsIDs.length} сделок`" :visible="visible" @cancel="() => { visible = false }" :width="600">
            <a-form layout="horizontal" :labelCol="{span: 6}" :wrapperCol="{span: 18}">
                <a-form-item label="Статус">
                    <a-select v-model:value="payload.statusID"/>
                </a-form-item>
                <a-form-item label="Ответственный">
                    <a-select v-model:value="payload.responsibleID" :options="userOptions" optionFilterProp="label" showSearch>
                        <template #option="{ label, avatar }">
                            <a-avatar :src="avatar"></a-avatar>
                            {{ label }}
                        </template>
                    </a-select>
                </a-form-item>
                <a-form-item label="Поля">
                    <a-tree-select v-model:value="payload.customFields" :treeData="customFieldTree" multiple showSearch allowClear treeCheckable/>
                </a-form-item>
                <a-form-item label="Дополнительно">
                </a-form-item> 
                <a-checkbox v-model:checked="payload.budget" v-bind="payload">Бюджет</a-checkbox>
                <a-checkbox v-model:checked="payload.linkedEntities">связанные сущности</a-checkbox>
            </a-form>
        </a-modal>
    </a-config-provider>
  </div>
</template>

<script lang="ts">
import { ConfigProvider, Modal, Form, Checkbox, Select, TreeSelect } from 'ant-design-vue'
import locale from 'ant-design-vue/es/locale/ru_RU'
import { defineComponent, getCurrentInstance, ref } from 'vue';
import axios from 'axios'
export default defineComponent ({
    setup() {
        const { app } = getCurrentInstance().appContext
        app.use(ConfigProvider)
        app.use(Modal)
        app.use(Form)
        app.use(Checkbox)
        app.use(Select)
        app.use(TreeSelect)
    },
    props: {
        leadsIDs: Array
    },
    data() {
        return {
            locale,
            visible: true,
            payload: {
                statusID: null,
                responsibleID: AMOCRM.constant('user').id,
                customFields: [],
                budget: ref(true),
                linkedEntities: ref(true)
            },
            userOptions: Object.values(AMOCRM.constant('managers')).map(user => ({label: user.title, avatar: user.avatar, value: Number(user.id)})),
            customFieldTree: []
        }
    },
    methods: {
        async getCustomFields() {
            const [ fields, groups ] = await Promise.all([
            await axios.get('/api/v4/leads/custom_fields', {
                params: { limit: 250 }
            })
            .then(({data}) => data._embedded.custom_fields),
            await axios.get('/api/v4/leads/custom_fields/groups', {
                params: { limit: 250 }
            })
            .then(({data}) => data._embedded.custom_field_groups)
            ])

            this.customFieldTree = groups
            //.filter(group => group.fields.length)
            .map(group => ({
                title: group.name,
                value: group.id
            }))
        }
    },
    async created() {
            await Promise.all([this.getCustomFields()])
        }
})
</script>

<style>

</style>