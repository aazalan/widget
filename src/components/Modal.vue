<template>
  <div>
    <a-config-provider :locale="locale">
        <a-modal :title="`Копирование ${leadsIDs.length} сделок`" :visible="visible" @cancel="() => { visible = false }" :width="600">
            <a-form layout="horizontal" :labelCol="{span: 6}" :wrapperCol="{span: 18}">
                <a-form-item label="Статус">
                    <a-select 
                    v-model:value="payload.statusID"
                    :options="statusOptions"
                    optionFilterProp="label"
                    showSearch>
                        <template #option="{label, color}">
                            <a-badge color="#f50" />{{ label }}
                        </template>
                    </a-select>
                </a-form-item>

                <a-form-item label="Ответственный">
                    <a-select v-model:value="payload.responsibleID" 
                    :options="userOptions" 
                    optionFilterProp="label" 
                    showSearch>
                        <template #option="{ label, avatar }">
                            <a-avatar :src="avatar"></a-avatar>
                            {{ label }}
                        </template>
                    </a-select>
                </a-form-item>

                <a-form-item label="Поля">
                    <a-tree-select 
                    v-model:value="payload.customFields" 
                    :treeData="customFieldTree" 
                    multiple 
                    showSearch 
                    allowClear 
                    treeCheckable
                    :maxTagCount="0"
                    :maxTagPlaceholder="value => `Выбрано ${value.length} полей`"
                    treeNodeFilterProp="title"/>
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
import { ConfigProvider, Modal, Form, Checkbox, Select, TreeSelect, Badge } from 'ant-design-vue'
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
        app.use(Badge)
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
            customFieldTree: [],
            statusOptions: []
        }
    },
    methods: {
        async getStatuses() {
            const { pipelines } = await axios.get('/api/v4/leads/pipelines').then(({data}) =>  data._embedded)

            this.statusOptions = pipelines.map((pipeline) => ({
                label: pipeline.name,
                options: pipeline._embedded.statuses
                .filter(status => status.type !== 1)
                .map(status => {
                    const compositStatusID = `${pipeline.id}_${status.id}`
                    if (!this.payload.statusID) this.payload.statusID = compositStatusID
                    return {
                        label: status.name,
                        value: compositStatusID,
                        color: status.color
                    }
                })
            }))
        },

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
            //.filter(group => group.fields.length || group.id == 'default')
            .map(group => ({
                title: group.name,
                value: group.id,
                children: fields
                .filter((field) => {
                    const groupID = [0, '', null].includes(field.group_id) ? 'default' : field.group_id
                    if (groupID === group.id) {
                        this.payload.customFields.push(field.id)
                        return true
                    }
                })
                .map(field => ({title: field.name, value: field.id }))
            }))
        }
    },
    async created() {
            await Promise.all([
                this.getCustomFields(),
                this.getStatuses()])
        }
})
</script>

<style>

</style>