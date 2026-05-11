// 员工类型
export interface Employee {
  id: string;
  employeeId: string;      // 工号
  name: string;           // 姓名
  department: string;     // 部门
  joinDate: string;       // 入职日期 YYYY-MM-DD
  baseCity: string;       // Base地
  bdmName: string;        // BDM姓名
  bdmId: string;          // BDM工号
  partnerName: string;    // 成长伙伴（表单填写后填充）
  partnerId: string;      // 成长伙伴工号
  form1Status: 'pending' | 'completed';  // 开营仪式-成长伙伴
  form2Status: 'pending' | 'completed';  // 录屏提交
  bdmReviewStatus: 'pending' | 'completed'; // BDM评价
  createdAt: string;
  updatedAt: string;
}

// 表单字段类型
export type FieldType = 'text' | 'number' | 'url' | 'date' | 'textarea' | 'rating';

// 表单字段
export interface Field {
  id: string;
  name: string;
  type: FieldType;
  required: boolean;
  placeholder?: string;
  minLength?: number;
  maxLength?: number;
}

// 表单模板
export interface FormTemplate {
  id: string;
  name: string;
  type: 'employee' | 'bdm_review';
  description: string;
  fields: Field[];
  createdAt: string;
  updatedAt: string;
}

// 表单提交记录
export interface FormSubmission {
  id: string;
  formTemplateId: string;
  formName: string;
  employeeId: string;
  employeeName: string;
  bdmId?: string;
  bdmName?: string;
  data: Record<string, string | number>;
  submittedAt: string;
  updatedAt: string;
  token: string;
  status: 'pending' | 'completed';
}

// 推送记录
export interface PushRecord {
  id: string;
  formTemplateId: string;
  formName: string;
  type: 'employee' | 'bdm_review';
  targetEmployeeIds: string[];
  targetBdmIds: string[];
  pushDate: string;
  submissions: {
    employeeId: string;
    status: 'pending' | 'completed';
    submissionId?: string;
  }[];
}

// 标签页类型
export type TabType = 'employees' | 'forms' | 'push' | 'stats';

// 表单填写数据 (用于前端)
export interface FormData {
  [key: string]: string;
}