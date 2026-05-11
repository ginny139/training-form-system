import React, { useState } from 'react';
import * as Tabs from '@radix-ui/react-tabs';
import { useStore } from '../store';
import { Table } from '../components/Table';
import { Modal } from '../components/Modal';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { StatusBadge } from '../components/Tag';
import { useToast } from '../components/Toast';
import { Plus, Copy, Check, Users, Send } from 'lucide-react';
import type { Employee } from '../types';

const AdminDashboard: React.FC = () => {
  const { employees, formTemplates, addEmployee, getPendingSubmissions } = useStore();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState('employees');
  
  // 员工管理状态
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newEmployee, setNewEmployee] = useState({
    name: '',
    employeeId: '',
    department: '',
    joinDate: new Date().toISOString().split('T')[0],
    baseCity: '',
    bdmName: '',
    bdmId: '',
  });

  // 表单分发状态
  const [selectedFormId, setSelectedFormId] = useState(formTemplates[0]?.id || '');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleAddEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    addEmployee(newEmployee);
    setIsAddModalOpen(false);
    setNewEmployee({
      name: '',
      employeeId: '',
      department: '',
      joinDate: new Date().toISOString().split('T')[0],
      baseCity: '',
      bdmName: '',
      bdmId: '',
    });
    showToast('success', '员工添加成功');
  };

  const copyLink = (employeeId: string) => {
    const link = `${window.location.origin}/fill/${selectedFormId}/${employeeId}`;
    navigator.clipboard.writeText(link).then(() => {
      setCopiedId(employeeId);
      showToast('success', '链接已复制到剪贴板');
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  const employeeColumns = [
    { key: 'name', title: '姓名' },
    { key: 'employeeId', title: '工号' },
    { key: 'department', title: '部门' },
    { key: 'bdmName', title: 'BDM' },
    { 
      key: 'form1Status', 
      title: '成长伙伴', 
      render: (status: 'completed' | 'pending') => <StatusBadge status={status} /> 
    },
    { 
      key: 'form2Status', 
      title: '录屏提交', 
      render: (status: 'completed' | 'pending') => <StatusBadge status={status} /> 
    },
    { 
      key: 'bdmReviewStatus', 
      title: 'BDM评价', 
      render: (status: 'completed' | 'pending') => <StatusBadge status={status} /> 
    },
    {
      key: 'overallStatus',
      title: '总体状态',
      render: (_: any, row: Employee) => {
        const isAllDone = row.form1Status === 'completed' && row.form2Status === 'completed' && row.bdmReviewStatus === 'completed';
        return isAllDone ? <span className="text-lg">✅</span> : <span className="text-[#868E96] text-sm">进行中</span>;
      }
    }
  ];

  const pendingEmployees = getPendingSubmissions(selectedFormId);

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      {/* Header */}
      <header className="bg-white border-b border-[#DEE2E6] px-8 py-4 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#4263EB] rounded-lg flex items-center justify-center">
              <Users className="text-white w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold text-[#212529]">新员工培训管理系统</h1>
          </div>
          <div className="flex items-center gap-4">
             <span className="text-sm text-[#868E96]">HR 管理员</span>
             <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-8 py-8">
        <Tabs.Root value={activeTab} onValueChange={setActiveTab} className="flex flex-col gap-6">
          <Tabs.List className="flex border-b border-[#DEE2E6] gap-8">
            <Tabs.Trigger
              value="employees"
              className={`pb-4 text-sm font-medium transition-colors relative ${
                activeTab === 'employees' ? 'text-[#4263EB]' : 'text-[#868E96] hover:text-[#495057]'
              }`}
            >
              员工管理
              {activeTab === 'employees' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#4263EB]"></div>
              )}
            </Tabs.Trigger>
            <Tabs.Trigger
              value="push"
              className={`pb-4 text-sm font-medium transition-colors relative ${
                activeTab === 'push' ? 'text-[#4263EB]' : 'text-[#868E96] hover:text-[#495057]'
              }`}
            >
              表单分发与追踪
              {activeTab === 'push' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#4263EB]"></div>
              )}
            </Tabs.Trigger>
          </Tabs.List>

          <Tabs.Content value="employees" className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-lg font-semibold text-[#212529]">员工列表</h2>
                <p className="text-sm text-[#868E96]">管理新员工基本信息及培训进度</p>
              </div>
              <Button onClick={() => setIsAddModalOpen(true)} className="gap-2">
                <Plus className="w-4 h-4" />
                添加员工
              </Button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-[#DEE2E6] overflow-hidden">
              <Table columns={employeeColumns} data={employees} />
            </div>
          </Tabs.Content>

          <Tabs.Content value="push" className="flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* Sidebar: Form Selection */}
              <div className="md:col-span-1 flex flex-col gap-4">
                <h3 className="font-semibold text-[#212529]">选择表单模板</h3>
                <div className="flex flex-col gap-2">
                  {formTemplates.map((template) => (
                    <button
                      key={template.id}
                      onClick={() => setSelectedFormId(template.id)}
                      className={`px-4 py-3 rounded-lg text-left text-sm transition-all ${
                        selectedFormId === template.id
                          ? 'bg-[#E7E5FF] text-[#4263EB] font-medium'
                          : 'bg-white border border-[#DEE2E6] text-[#495057] hover:border-[#4263EB]'
                      }`}
                    >
                      {template.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Main: Pending Employees */}
              <div className="md:col-span-3 flex flex-col gap-4">
                <div className="flex justify-between items-center">
                   <h3 className="font-semibold text-[#212529]">
                     未完成员工 ({pendingEmployees.length})
                   </h3>
                </div>
                
                <div className="bg-white rounded-xl shadow-sm border border-[#DEE2E6] overflow-hidden">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-[#F8F9FA] border-b border-[#DEE2E6]">
                        <th className="px-6 py-3 text-left text-sm font-semibold text-[#212529]">员工姓名</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-[#212529]">状态</th>
                        <th className="px-6 py-3 text-right text-sm font-semibold text-[#212529]">操作</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pendingEmployees.length === 0 ? (
                        <tr>
                          <td colSpan={3} className="px-6 py-12 text-center text-[#868E96]">
                            所有员工已完成该表单
                          </td>
                        </tr>
                      ) : (
                        pendingEmployees.map((emp) => (
                          <tr key={emp.employeeId} className="border-b border-[#DEE2E6] last:border-0">
                            <td className="px-6 py-4 text-sm text-[#212529] font-medium">{emp.employeeName}</td>
                            <td className="px-6 py-4 text-sm text-[#FF6B6B]">{emp.status}</td>
                            <td className="px-6 py-4 text-right">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => copyLink(emp.employeeId)}
                                className="gap-2"
                              >
                                {copiedId === emp.employeeId ? (
                                  <>
                                    <Check className="w-4 h-4 text-green-500" />
                                    已复制
                                  </>
                                ) : (
                                  <>
                                    <Copy className="w-4 h-4" />
                                    复制链接
                                  </>
                                )}
                              </Button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </Tabs.Content>
        </Tabs.Root>
      </main>

      {/* Add Employee Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="添加新员工"
        footer={
          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => setIsAddModalOpen(false)}>取消</Button>
            <Button onClick={handleAddEmployee}>确定添加</Button>
          </div>
        }
      >
        <form onSubmit={handleAddEmployee} className="grid grid-cols-2 gap-4">
          <Input
            label="姓名"
            placeholder="请输入员工姓名"
            required
            value={newEmployee.name}
            onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
          />
          <Input
            label="工号"
            placeholder="请输入工号 (如 EMP001)"
            required
            value={newEmployee.employeeId}
            onChange={(e) => setNewEmployee({ ...newEmployee, employeeId: e.target.value })}
          />
          <Input
            label="部门"
            placeholder="请输入部门"
            required
            value={newEmployee.department}
            onChange={(e) => setNewEmployee({ ...newEmployee, department: e.target.value })}
          />
          <Input
            label="入职日期"
            type="date"
            required
            value={newEmployee.joinDate}
            onChange={(e) => setNewEmployee({ ...newEmployee, joinDate: e.target.value })}
          />
          <Input
            label="Base地"
            placeholder="请输入办公地点"
            value={newEmployee.baseCity}
            onChange={(e) => setNewEmployee({ ...newEmployee, baseCity: e.target.value })}
          />
          <div className="col-span-2 grid grid-cols-2 gap-4 border-t border-[#DEE2E6] pt-4 mt-2">
            <Input
              label="BDM姓名"
              placeholder="请输入对应 BDM 姓名"
              value={newEmployee.bdmName}
              onChange={(e) => setNewEmployee({ ...newEmployee, bdmName: e.target.value })}
            />
            <Input
              label="BDM工号"
              placeholder="请输入 BDM 工号"
              value={newEmployee.bdmId}
              onChange={(e) => setNewEmployee({ ...newEmployee, bdmId: e.target.value })}
            />
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminDashboard;
