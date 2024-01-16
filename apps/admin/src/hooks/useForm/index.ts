/*
 * 2024-01-13 21:29:50
 * @Github: https://github.com/melelong
 * custom_string_obkoro1~custom_string_obkoro100都可以输出自定义信息
 * @Author: melelong
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 * @LastEditors: 可以输入预定的版权声明、个性签名、空行等
 */
import type { Rule } from 'ant-design-vue/es/form'
import { ref, type UnwrapRef } from 'vue'
/**
 * 单个生成自定义规则函数的配置对象类型
 */
export type RulePassConfig<passType> = {
  isPass: ((value: passType) => boolean) | (() => boolean)
  message: string
}
/**
 * 生成自定义规则函数的配置对象数组类型
 */
export type RulePassConfigArray<passType> = Array<RulePassConfig<passType>>
/**
 * 所有的生成自定义规则函数的配置对象类型
 */
export type AllRulePassConfig<passType> = {
  [key: string]: RulePassConfigArray<passType>
}
/**
 * 自定义规则函数类型
 */
export type RulePassFunction<passType> = (_rule: Rule, value: passType) => Promise<void>
/**
 * 所有生成表单规则的配置对象类型
 */
export type FormRulesConfig<passType> = {
  [key: string]: {
    passFn: RulePassFunction<passType>
    isRequired?: boolean
  }
}
/**
 * 表单状态
 * @param data 表单数据
 * @returns {UnwrapRef<formStateType>} 表单状态
 */
export function useFormState<formStateType>(data: formStateType): UnwrapRef<formStateType> {
  const formRef = ref<formStateType>(data)
  return formRef.value
}

/**
 * 生成自定义规则函数
 * @param rules 生成自定义规则函数的配置对象
 * @param passDo 规则通过后要做的事
 * @returns
 */
export function useFormPass<passType>(
  rules: RulePassConfigArray<passType>
): RulePassFunction<passType> {
  return async (_rule: Rule, value: passType) => {
    for (let i = 0; i < rules.length; i++) {
      if (rules[i].isPass(value)) {
        return Promise.reject(rules[i].message)
      }
    }
    return Promise.resolve()
  }
}
/**
 * 生成表单所有控件的校验规则
 * @param config 所有生成表单规则的配置对象
 * @returns
 */
export function useFormRules<passType>(config: FormRulesConfig<passType>) {
  const configKeys = Object.keys(config)
  const rules: Record<string, Array<Rule>> = {}
  configKeys.forEach((key: string) => {
    rules[key] = [
      {
        validator: config[key].passFn,
        trigger: 'change'
      }
    ]
    rules[key][0]['required'] = !!config[key].isRequired
  })
  return rules
}
