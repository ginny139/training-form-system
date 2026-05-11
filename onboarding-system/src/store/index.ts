import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Employee, FormTemplate, FormSubmission, PushRecord } from '../types';
import { v4 as uuidv4 } from 'uuid';

// 生成唯一token
const generateToken = () => {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
};

// 示例BDM数据
const sampleBdms = [
  { id: 'bdm001', name: '张明', employeeId: 'BDM001' },
  { id: 'bdm002', name: '李华', employeeId: 'BDM002' },
  { id: 'bdm003', name: '王芳', employeeId: 'BDM003' },
];

// 示例表单模板
const sampleFormTemplates: FormTemplate[] = [
  {
    id: 'form-1',
    name: '成长伙伴信息填写',
    type: 'employee',
    description: '开营仪式 - 成长伙伴信息',
    fields: [
      { id: 'f1-1', name: '成长伙伴姓名', type: 'text', required: true, placeholder: '请输入成长伙伴的姓名' },
      { id: 'f1-2', name: '成长伙伴工号', type: 'text', required: true, placeholder: '请输入成长伙伴的工号' },
      { id: 'f1-3', name: '补充说明', type: 'textarea', required: false, placeholder: '如有其他补充信息请填写' },
    ],
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
  },
  {
    id: 'form-2',
    name: '话术对练录屏提交',
    type: 'employee',
    description: '直播课程结束后 - 提交录屏链接',
    fields: [
      { id: 'f2-1', name: '录屏链接', type: 'url', required: true, placeholder: '请粘贴录屏链接（支持抖音、B站等平台）' },
      { id: 'f2-2', name: '提交时间', type: 'date', required: true },
      { id: 'f2-3', name: '备注', type: 'textarea', required: false, placeholder: '如有特殊情况请说明' },
    ],
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
  },
  {
    id: 'form-3',
    name: '话术对练评价',
    type: 'bdm_review',
    description: 'BDM对员工话术对练的评价',
    fields: [
      { id: 'f3-1', name: '综合评级', type: 'rating', required: true },
      { id: 'f3-2', name: '评价内容', type: 'textarea', required: true, placeholder: '请填写对员工话术对练的评价（至少20字）', minLength: 20 },
      { id: 'f3-3', name: '改进建议', type: 'textarea', required: false, placeholder: '如有改进建议请填写' },
    ],
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
  },
];

// 示例员工数据（符合场景：ABC三人入职，不同完成状态）
const sampleEmployees: Employee[] = [
  {
    id: 'emp-1',
    employeeId: 'EMP001',
    name: '张三',
    department: '销售部',
    joinDate: '2024-01-15',
    baseCity: '北京',
    bdmName: '张明',
    bdmId: 'BDM001',
    partnerName: '',
    partnerId: '',
    form1Status: 'completed',
    form2Status: 'completed',
    bdmReviewStatus: 'completed',
    createdAt: '2024-01-15T09:00:00Z',
    updatedAt: '2024-01-15T14:30:00Z',
  },
  {
    id: 'emp-2',
    employeeId: 'EMP002',
    name: '李四',
    department: '销售部',
    joinDate: '2024-01-15',
    baseCity: '上海',
    bdmName: '李华',
    bdmId: 'BDM002',
    partnerName: '王五',
    partnerId: 'EMP003',
    form1Status: 'completed',
    form2Status: 'pending',
    bdmReviewStatus: 'pending',
    createdAt: '2024-01-15T09:00:00Z',
    updatedAt: '2024-01-15T14:30:00Z',
  },
  {
    id: 'emp-3',
    employeeId: 'EMP003',
    name: '王五',
    department: '市场部',
    joinDate: '2024-01-16',
    baseCity: '深圳',
    bdmName: '王芳',
    bdmId: 'BDM003',
    partnerName: '',
    partnerId: '',
    form1Status: 'pending',
    form2Status: 'pending',
    bdmReviewStatus: 'pending',
    createdAt: '2024-01-16T09:00:00Z',
    updatedAt: '2024-01-16T09:00:00Z',
  },
];

interface StoreState {
  // 数据
  employees: Employee[];
  formTemplates: FormTemplate[];
  submissions: FormSubmission[];
  pushRecords: PushRecord[];

  // 员工管理操作
  addEmployee: (employee: Omit<Employee, 'id' | 'createdAt' | 'updatedAt' | 'form1Status' | 'form2Status' | 'bdmReviewStatus' | 'partnerName' | 'partnerId'>) => void;
  updateEmployee: (id: string, updates: Partial<Employee>) => void;
  deleteEmployee: (id: string) => void;
  batchImportEmployees: (employees: Array<Omit<Employee, 'id' | 'createdAt' | 'updatedAt' | 'form1Status' | 'form2Status' | 'bdmReviewStatus' | 'partnerName' | 'partnerId'>>) => { success: number; failed: Array<{ data: any; reason: string }> };

  // 表单模板操作
  addFormTemplate: (template: Omit<FormTemplate, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateFormTemplate: (id: string, updates: Partial<FormTemplate>) => void;
  deleteFormTemplate: (id: string) => void;

  // 表单提交操作
  submitForm: (submission: Omit<FormSubmission, 'id' | 'submittedAt' | 'updatedAt' | 'token'>) => string;
  updateSubmission: (id: string, data: Record<string, string | number>) => void;
  getEmployeeSubmissions: (employeeId: string) => FormSubmission[];
  getBdmSubmissions: (bdmId: string) => FormSubmission[];

  // 推送操作
  pushFormToEmployees: (formTemplateId: string, employeeIds: string[]) => string;
  pushReviewToBdms: (formTemplateId: string, employeeIds: string[]) => string;
  getPendingSubmissions: (formTemplateId: string) => { employeeId: string; employeeName: string; status: string }[];

  // 工具方法
  getEmployeeById: (id: string) => Employee | undefined;
  getFormTemplateById: (id: string) => FormTemplate | undefined;
  getBdms: () => { id: string; name: string; employeeId: string }[];
  getCompletedCount: () => { form1: number; form2: number; bdmReview: number };
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      // 初始数据
      employees: sampleEmployees,
      formTemplates: sampleFormTemplates,
      submissions: [],
      pushRecords: [],

      // ==================== 员工管理 ====================

      addEmployee: (employeeData) => {
        const now = new Date().toISOString();
        const newEmployee: Employee = {
          ...employeeData,
          id: uuidv4(),
          partnerName: '',
          partnerId: '',
          form1Status: 'pending',
          form2Status: 'pending',
          bdmReviewStatus: 'pending',
          createdAt: now,
          updatedAt: now,
        };
        set((state) => ({
          employees: [...state.employees, newEmployee],
        }));
      },

      updateEmployee: (id, updates) => {
        set((state) => ({
          employees: state.employees.map((emp) =>
            emp.id === id
              ? { ...emp, ...updates, updatedAt: new Date().toISOString() }
              : emp
          ),
        }));
      },

      deleteEmployee: (id) => {
        set((state) => ({
          employees: state.employees.filter((emp) => emp.id !== id),
        }));
      },

      batchImportEmployees: (employeesData) => {
        const now = new Date().toISOString();
        const existingEmployeeIds = get().employees.map((e) => e.employeeId);
        const results = {
          success: 0,
          failed: [] as Array<{ data: any; reason: string }>,
        };

        const newEmployees: Employee[] = [];

        employeesData.forEach((empData) => {
          // 校验工号唯一性
          if (existingEmployeeIds.includes(empData.employeeId)) {
            results.failed.push({
              data: empData,
              reason: `工号 ${empData.employeeId} 已存在`,
            });
            return;
          }

          // 校验必填项
          if (!empData.name || !empData.employeeId || !empData.department) {
            results.failed.push({
              data: empData,
              reason: '姓名、工号、部门为必填项',
            });
            return;
          }

          newEmployees.push({
            ...empData,
            id: uuidv4(),
            partnerName: '',
            partnerId: '',
            form1Status: 'pending',
            form2Status: 'pending',
            bdmReviewStatus: 'pending',
            createdAt: now,
            updatedAt: now,
          });
          results.success++;
        });

        if (newEmployees.length > 0) {
          set((state) => ({
            employees: [...state.employees, ...newEmployees],
          }));
        }

        return results;
      },

      // ==================== 表单模板管理 ====================

      addFormTemplate: (templateData) => {
        const now = new Date().toISOString();
        const newTemplate: FormTemplate = {
          ...templateData,
          id: uuidv4(),
          createdAt: now,
          updatedAt: now,
        };
        set((state) => ({
          formTemplates: [...state.formTemplates, newTemplate],
        }));
      },

      updateFormTemplate: (id, updates) => {
        set((state) => ({
          formTemplates: state.formTemplates.map((t) =>
            t.id === id
              ? { ...t, ...updates, updatedAt: new Date().toISOString() }
              : t
          ),
        }));
      },

      deleteFormTemplate: (id) => {
        set((state) => ({
          formTemplates: state.formTemplates.filter((t) => t.id !== id),
        }));
      },

      // ==================== 表单提交 ====================

      submitForm: (submissionData) => {
        const now = new Date().toISOString();
        const token = generateToken();
        const submissionId = uuidv4();

        const newSubmission: FormSubmission = {
          ...submissionData,
          id: submissionId,
          submittedAt: now,
          updatedAt: now,
          token,
          status: 'completed',
        };

        // 保存提交记录
        set((state) => ({
          submissions: [...state.submissions, newSubmission],
        }));

        // 同步更新员工数据
        const { employees } = get();
        const employee = employees.find((e) => e.id === submissionData.employeeId);

        if (employee) {
          const updates: Partial<Employee> = {};

          if (submissionData.formName === '成长伙伴信息填写') {
            // 表单1：成长伙伴信息
            updates.partnerName = submissionData.data['成长伙伴姓名'] as string || '';
            updates.partnerId = submissionData.data['成长伙伴工号'] as string || '';
            updates.form1Status = 'completed';
          } else if (submissionData.formName === '话术对练录屏提交') {
            // 表单2：录屏提交
            updates.form2Status = 'completed';
          } else if (submissionData.formName === '话术对练评价') {
            // BDM评价
            updates.bdmReviewStatus = 'completed';
          }

          // 更新员工状态
          set((state) => ({
            employees: state.employees.map((e) =>
              e.id === submissionData.employeeId
                ? { ...e, ...updates, updatedAt: now }
                : e
            ),
          }));
        }

        return token;
      },

      updateSubmission: (id, data) => {
        const now = new Date().toISOString();

        set((state) => ({
          submissions: state.submissions.map((s) =>
            s.id === id
              ? { ...s, data: { ...s.data, ...data }, updatedAt: now }
              : s
          ),
        }));

        // 同时更新关联的员工数据
        const submission = get().submissions.find((s) => s.id === id);
        if (submission) {
          const { employees } = get();
          const employee = employees.find((e) => e.id === submission.employeeId);

          if (employee && submission.formName === '成长伙伴信息填写') {
            set((state) => ({
              employees: state.employees.map((e) =>
                e.id === submission.employeeId
                  ? {
                      ...e,
                      partnerName: data['成长伙伴姓名'] as string || e.partnerName,
                      partnerId: data['成长伙伴工号'] as string || e.partnerId,
                      updatedAt: now,
                    }
                  : e
              ),
            }));
          }
        }
      },

      getEmployeeSubmissions: (employeeId) => {
        return get().submissions.filter((s) => s.employeeId === employeeId);
      },

      getBdmSubmissions: (bdmId) => {
        return get().submissions.filter((s) => s.bdmId === bdmId);
      },

      // ==================== 推送管理 ====================

      pushFormToEmployees: (formTemplateId, employeeIds) => {
        const template = get().formTemplates.find((t) => t.id === formTemplateId);
        if (!template) return '';

        const now = new Date().toISOString();
        const recordId = uuidv4();

        const newRecord: PushRecord = {
          id: recordId,
          formTemplateId,
          formName: template.name,
          type: template.type,
          targetEmployeeIds: employeeIds,
          targetBdmIds: [],
          pushDate: now,
          submissions: employeeIds.map((empId) => ({
            employeeId: empId,
            status: 'pending' as const,
          })),
        };

        set((state) => ({
          pushRecords: [...state.pushRecords, newRecord],
        }));

        return recordId;
      },

      pushReviewToBdms: (formTemplateId, employeeIds) => {
        const template = get().formTemplates.find((t) => t.id === formTemplateId);
        if (!template) return '';

        const employees = get().employees;
        const now = new Date().toISOString();
        const recordId = uuidv4();

        // 获取每个员工的BDM
        const bdmMap = new Map<string, string[]>();
        employeeIds.forEach((empId) => {
          const emp = employees.find((e) => e.id === empId);
          if (emp && emp.bdmId) {
            const existing = bdmMap.get(emp.bdmId) || [];
            if (!existing.includes(empId)) {
              bdmMap.set(emp.bdmId, [...existing, empId]);
            }
          }
        });

        const targetBdmIds = Array.from(bdmMap.keys());

        const newRecord: PushRecord = {
          id: recordId,
          formTemplateId,
          formName: template.name,
          type: 'bdm_review',
          targetEmployeeIds: employeeIds,
          targetBdmIds,
          pushDate: now,
          submissions: targetBdmIds.flatMap((bdmId) => {
            const empIds = bdmMap.get(bdmId) || [];
            return empIds.map((empId) => ({
              employeeId: empId,
              status: 'pending' as const,
            }));
          }),
        };

        set((state) => ({
          pushRecords: [...state.pushRecords, newRecord],
        }));

        return recordId;
      },

      getPendingSubmissions: (formTemplateId) => {
        const employees = get().employees;
        const template = get().formTemplates.find((t) => t.id === formTemplateId);
        if (!template) return [];

        if (template.type === 'employee') {
          return employees
            .filter((e) => {
              if (template.name === '成长伙伴信息填写') return e.form1Status === 'pending';
              if (template.name === '话术对练录屏提交') return e.form2Status === 'pending';
              return false;
            })
            .map((e) => ({
              employeeId: e.id,
              employeeName: e.name,
              status: '未完成',
            }));
        } else {
          return employees
            .filter((e) => e.bdmReviewStatus === 'pending')
            .map((e) => ({
              employeeId: e.id,
              employeeName: e.name,
              status: '未完成',
            }));
        }
      },

      // ==================== 工具方法 ====================

      getEmployeeById: (id) => {
        return get().employees.find((e) => e.id === id);
      },

      getFormTemplateById: (id) => {
        return get().formTemplates.find((t) => t.id === id);
      },

      getBdms: () => {
        return sampleBdms;
      },

      getCompletedCount: () => {
        const employees = get().employees;
        return {
          form1: employees.filter((e) => e.form1Status === 'completed').length,
          form2: employees.filter((e) => e.form2Status === 'completed').length,
          bdmReview: employees.filter((e) => e.bdmReviewStatus === 'completed').length,
        };
      },
    }),
    {
      name: 'training-form-storage',
    }
  )
);