import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { Input, Textarea } from '../components/Input';
import { Button } from '../components/Button';
import { Rating } from '../components/Rating';
import { useToast } from '../components/Toast';
import { CheckCircle2, ChevronLeft, Info } from 'lucide-react';

const FormFillPage: React.FC = () => {
  const { formTemplateId, employeeId } = useParams<{ formTemplateId: string; employeeId: string }>();
  const navigate = useNavigate();
  const { getFormTemplateById, getEmployeeById, submitForm } = useStore();
  const { showToast } = useToast();

  const [template, setTemplate] = useState<any>(null);
  const [employee, setEmployee] = useState<any>(null);
  const [formData, setFormData] = useState<Record<string, string | number>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (formTemplateId) {
      const t = getFormTemplateById(formTemplateId);
      setTemplate(t);
    }
    if (employeeId) {
      const e = getEmployeeById(employeeId);
      setEmployee(e);
    }
  }, [formTemplateId, employeeId, getFormTemplateById, getEmployeeById]);

  if (!template || !employee) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F9FA]">
        <div className="text-center p-8 bg-white rounded-xl shadow-sm border border-[#DEE2E6]">
          <h2 className="text-xl font-bold text-[#212529] mb-2">未找到表单或员工</h2>
          <p className="text-[#868E96] mb-6">链接可能已失效或参数不正确</p>
          <Button onClick={() => navigate('/')}>返回首页</Button>
        </div>
      </div>
    );
  }

  const handleFieldChange = (fieldName: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [fieldName]: value }));
    // 清除该字段的错误
    if (errors[fieldName]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[fieldName];
        return next;
      });
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    template.fields.forEach((field: any) => {
      const value = formData[field.name];
      if (field.required && (!value || value.toString().trim() === '')) {
        newErrors[field.name] = `${field.name}为必填项`;
      }
      
      // BDM 评价字数校验
      if (template.type === 'bdm_review' && field.name === '评价内容') {
        const textValue = (value as string) || '';
        if (textValue.length < 20) {
          newErrors[field.name] = '评价内容至少需要20个字';
        }
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      showToast('error', '请检查表单填写是否正确');
      return;
    }

    setLoading(true);
    try {
      // 模拟提交过程
      await new Promise((resolve) => setTimeout(resolve, 800));
      
      submitForm({
        formTemplateId: template.id,
        formName: template.name,
        employeeId: employee.id,
        employeeName: employee.name,
        bdmId: employee.bdmId,
        bdmName: employee.bdmName,
        data: formData,
      });

      setIsSubmitted(true);
      showToast('success', '提交成功');
    } catch (err) {
      showToast('error', '提交失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F9FA] p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-10 text-center animate-in fade-in zoom-in duration-300">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-[#212529] mb-4">提交成功</h2>
          <p className="text-[#495057] mb-8 leading-relaxed">
            您填写的 <span className="font-semibold">{template.name}</span> 已收到。
            感谢您的配合，数据已实时同步到后台。
          </p>
          <Button variant="secondary" onClick={() => navigate('/')} className="w-full">
            返回管理后台
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-12">
      {/* Navbar */}
      <nav className="bg-white border-b border-[#DEE2E6] px-4 py-4 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={() => navigate('/')} className="gap-1 px-0 hover:bg-transparent">
            <ChevronLeft className="w-4 h-4" />
            返回
          </Button>
          <span className="text-sm font-medium text-[#868E96]">表单填写</span>
          <div className="w-8"></div>
        </div>
      </nav>

      <main className="max-w-2xl mx-auto px-4 mt-8">
        <div className="bg-white rounded-2xl shadow-sm border border-[#DEE2E6] overflow-hidden">
          {/* Header */}
          <div className="bg-[#4263EB] px-8 py-10 text-white">
            <h1 className="text-2xl font-bold mb-2">{template.name}</h1>
            <p className="opacity-90">{template.description}</p>
          </div>

          {/* Employee Info */}
          <div className="px-8 py-4 bg-[#F1F3FF] border-b border-[#DEE2E6] flex items-center gap-4">
             <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                <span className="text-[#4263EB] font-bold">{employee.name.charAt(0)}</span>
             </div>
             <div>
               <p className="text-xs text-[#868E96] uppercase font-bold tracking-wider">当前填写对象</p>
               <p className="font-semibold text-[#212529]">{employee.name} ({employee.employeeId}) · {employee.department}</p>
             </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-8 flex flex-col gap-8">
            {template.fields.map((field: any) => (
              <div key={field.id} className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-bold text-[#212529]">
                    {field.name}
                    {field.required && <span className="text-red-500 ml-1">*</span>}
                  </label>
                  {field.name === '评价内容' && (
                    <span className={`text-xs ${(formData[field.name]?.toString() || '').length >= 20 ? 'text-green-500' : 'text-[#868E96]'}`}>
                      {(formData[field.name]?.toString() || '').length} / 20 字以上
                    </span>
                  )}
                </div>

                {field.type === 'rating' ? (
                  <div className="py-2">
                    <Rating
                      value={(formData[field.name] as number) || 0}
                      onChange={(val) => handleFieldChange(field.name, val)}
                    />
                    {errors[field.name] && <p className="text-xs text-red-500 mt-1">{errors[field.name]}</p>}
                  </div>
                ) : field.type === 'textarea' ? (
                  <Textarea
                    placeholder={field.placeholder}
                    required={field.required}
                    value={(formData[field.name] as string) || ''}
                    onChange={(e) => handleFieldChange(field.name, e.target.value)}
                    error={errors[field.name]}
                    rows={4}
                  />
                ) : (
                  <Input
                    type={field.type}
                    placeholder={field.placeholder}
                    required={field.required}
                    value={(formData[field.name] as string) || ''}
                    onChange={(e) => handleFieldChange(field.name, e.target.value)}
                    error={errors[field.name]}
                  />
                )}
              </div>
            ))}

            <div className="pt-4 flex flex-col gap-4">
              <div className="p-4 bg-amber-50 rounded-lg border border-amber-200 flex gap-3">
                <Info className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <p className="text-xs text-amber-800 leading-relaxed">
                  请确保填写信息的真实性与准确性。提交后数据将自动同步给 HR 部门，部分关键字段提交后将不支持二次修改。
                </p>
              </div>
              <Button type="submit" size="lg" loading={loading} className="w-full py-4 rounded-xl shadow-lg shadow-blue-200">
                立即提交
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default FormFillPage;
