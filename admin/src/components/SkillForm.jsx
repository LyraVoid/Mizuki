import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

export default function SkillForm({ skill, onSave, onCancel }) {
  const { lang } = useLanguage();
  const [formData, setFormData] = useState(skill || {
    id: '',
    name: '',
    description: '',
    icon: '',
    category: 'frontend',
    level: 'intermediate',
    experience: { years: 0, months: 0 },
    projects: [],
    certifications: [],
    color: '#000000'
  });

  const [projectInput, setProjectInput] = useState('');
  const [certInput, setCertInput] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleExperienceChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      experience: {
        ...prev.experience,
        [field]: parseInt(value) || 0
      }
    }));
  };

  const handleAddProject = () => {
    if (projectInput.trim()) {
      setFormData(prev => ({
        ...prev,
        projects: [...(prev.projects || []), projectInput.trim()]
      }));
      setProjectInput('');
    }
  };

  const handleRemoveProject = (index) => {
    setFormData(prev => ({
      ...prev,
      projects: (prev.projects || []).filter((_, i) => i !== index)
    }));
  };

  const handleAddCert = () => {
    if (certInput.trim()) {
      setFormData(prev => ({
        ...prev,
        certifications: [...(prev.certifications || []), certInput.trim()]
      }));
      setCertInput('');
    }
  };

  const handleRemoveCert = (index) => {
    setFormData(prev => ({
      ...prev,
      certifications: (prev.certifications || []).filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.id || !formData.name || !formData.description) {
      alert(lang === 'zh' ? '请填写必填字段' : 'Please fill in required fields');
      return;
    }

    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* ID */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          ID <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="id"
          value={formData.id}
          onChange={handleChange}
          disabled={!!skill}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
          placeholder="skill-unique-id"
        />
      </div>

      {/* Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {lang === 'zh' ? '名称' : 'Name'} <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {lang === 'zh' ? '描述' : 'Description'} <span className="text-red-500">*</span>
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Category & Level */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {lang === 'zh' ? '类别' : 'Category'}
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="frontend">{lang === 'zh' ? '前端' : 'Frontend'}</option>
            <option value="backend">{lang === 'zh' ? '后端' : 'Backend'}</option>
            <option value="database">{lang === 'zh' ? '数据库' : 'Database'}</option>
            <option value="tools">{lang === 'zh' ? '工具' : 'Tools'}</option>
            <option value="other">{lang === 'zh' ? '其他' : 'Other'}</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {lang === 'zh' ? '水平' : 'Level'}
          </label>
          <select
            name="level"
            value={formData.level}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="beginner">{lang === 'zh' ? '初级' : 'Beginner'}</option>
            <option value="intermediate">{lang === 'zh' ? '中级' : 'Intermediate'}</option>
            <option value="advanced">{lang === 'zh' ? '高级' : 'Advanced'}</option>
            <option value="expert">{lang === 'zh' ? '专家' : 'Expert'}</option>
          </select>
        </div>
      </div>

      {/* Experience */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {lang === 'zh' ? '经验 (年)' : 'Experience (Years)'}
          </label>
          <input
            type="number"
            min="0"
            value={formData.experience?.years || 0}
            onChange={(e) => handleExperienceChange('years', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {lang === 'zh' ? '经验 (月)' : 'Experience (Months)'}
          </label>
          <input
            type="number"
            min="0"
            max="11"
            value={formData.experience?.months || 0}
            onChange={(e) => handleExperienceChange('months', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Projects */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {lang === 'zh' ? '相关项目' : 'Related Projects'}
        </label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={projectInput}
            onChange={(e) => setProjectInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddProject())}
            placeholder={lang === 'zh' ? '项目名称' : 'Project name'}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="button"
            onClick={handleAddProject}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            {lang === 'zh' ? '添加' : 'Add'}
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {(formData.projects || []).map((proj, index) => (
            <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded flex items-center gap-1">
              {proj}
              <button
                type="button"
                onClick={() => handleRemoveProject(index)}
                className="text-red-500 hover:text-red-700"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* Certifications */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {lang === 'zh' ? '认证' : 'Certifications'}
        </label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={certInput}
            onChange={(e) => setCertInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCert())}
            placeholder={lang === 'zh' ? '认证名称' : 'Certification name'}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="button"
            onClick={handleAddCert}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            {lang === 'zh' ? '添加' : 'Add'}
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {(formData.certifications || []).map((cert, index) => (
            <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded flex items-center gap-1">
              {cert}
              <button
                type="button"
                onClick={() => handleRemoveCert(index)}
                className="text-red-500 hover:text-red-700"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* Icon & Color */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {lang === 'zh' ? '图标' : 'Icon'}
          </label>
          <input
            type="text"
            name="icon"
            value={formData.icon || ''}
            onChange={handleChange}
            placeholder="icon-name"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {lang === 'zh' ? '颜色' : 'Color'}
          </label>
          <input
            type="color"
            name="color"
            value={formData.color || '#000000'}
            onChange={handleChange}
            className="w-full h-10 px-3 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          {lang === 'zh' ? '保存' : 'Save'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          {lang === 'zh' ? '取消' : 'Cancel'}
        </button>
      </div>
    </form>
  );
}
