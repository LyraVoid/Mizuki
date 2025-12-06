import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Search, Filter, Calendar, Code, ExternalLink, Github, Plus, Edit, Trash2, RefreshCw } from 'lucide-react';
import EditModal from '../components/EditModal';
import ProjectForm from '../components/ProjectForm';
import ConfirmDialog from '../components/ConfirmDialog';

export default function DataProjects() {
  const { lang, t } = useLanguage();
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // Modal states
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [deletingProject, setDeletingProject] = useState(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [notification, setNotification] = useState(null);

  // Fetch projects data
  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/data/projects');
      const data = await response.json();
      
      if (data.success) {
        setProjects(data.data);
        setFilteredProjects(data.data);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
      alert('Failed to load projects data');
    } finally {
      setLoading(false);
    }
  };

  // Apply filters
  useEffect(() => {
    let filtered = [...projects];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(p => 
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(p => p.category === categoryFilter);
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(p => p.status === statusFilter);
    }

    setFilteredProjects(filtered);
  }, [searchTerm, categoryFilter, statusFilter, projects]);

  // Show notification
  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // Handle create
  const handleCreate = () => {
    setEditingProject(null);
    setIsEditModalOpen(true);
  };

  // Handle edit
  const handleEdit = (project) => {
    setEditingProject(project);
    setIsEditModalOpen(true);
  };

  // Handle save (create or update)
  const handleSave = async (projectData) => {
    try {
      const isUpdate = !!editingProject;
      const url = isUpdate 
        ? `/api/data/projects/${editingProject.id}`
        : '/api/data/projects';
      const method = isUpdate ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(projectData)
      });

      const data = await response.json();

      if (data.success) {
        await fetchProjects(); // Refresh list
        setIsEditModalOpen(false);
        showNotification(
          isUpdate
            ? (lang === 'zh' ? '项目已更新' : 'Project updated')
            : (lang === 'zh' ? '项目已创建' : 'Project created')
        );
      } else {
        alert(data.error || 'Operation failed');
      }
    } catch (error) {
      console.error('Error saving project:', error);
      alert('Failed to save project');
    }
  };

  // Handle delete
  const handleDelete = (project) => {
    setDeletingProject(project);
    setIsDeleteDialogOpen(true);
  };

  // Confirm delete
  const confirmDelete = async () => {
    try {
      const response = await fetch(`/api/data/projects/${deletingProject.id}`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (data.success) {
        await fetchProjects(); // Refresh list
        setIsDeleteDialogOpen(false);
        setDeletingProject(null);
        showNotification(lang === 'zh' ? '项目已删除' : 'Project deleted');
      } else {
        alert(data.error || 'Delete failed');
      }
    } catch (error) {
      console.error('Error deleting project:', error);
      alert('Failed to delete project');
    }
  };

  // Handle sync to TypeScript
  const handleSync = async () => {
    try {
      setIsSyncing(true);
      const response = await fetch('/api/data/projects/sync', {
        method: 'POST'
      });

      const data = await response.json();

      if (data.success) {
        showNotification(lang === 'zh' ? 'TS文件已更新' : 'TypeScript file synced');
      } else {
        alert(data.error || 'Sync failed');
      }
    } catch (error) {
      console.error('Error syncing to TypeScript:', error);
      alert('Failed to sync');
    } finally {
      setIsSyncing(false);
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      completed: 'bg-green-100 text-green-700',
      'in-progress': 'bg-blue-100 text-blue-700',
      planned: 'bg-gray-100 text-gray-700'
    };
    const labels = {
      completed: lang === 'zh' ? '已完成' : 'Completed',
      'in-progress': lang === 'zh' ? '进行中' : 'In Progress',
      planned: lang === 'zh' ? '计划中' : 'Planned'
    };
    return (
      <span className={`px-2 py-1 rounded text-xs font-medium ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  const getCategoryLabel = (category) => {
    const labels = {
      web: lang === 'zh' ? 'Web' : 'Web',
      mobile: lang === 'zh' ? '移动应用' : 'Mobile',
      desktop: lang === 'zh' ? '桌面应用' : 'Desktop',
      other: lang === 'zh' ? '其他' : 'Other'
    };
    return labels[category] || category;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-gray-500">Loading projects...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg ${
          notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
        } text-white`}>
          {notification.message}
        </div>
      )}

      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            {lang === 'zh' ? '项目管理' : 'Projects Management'}
          </h1>
          <p className="text-gray-600 text-sm">
            {lang === 'zh' ? '查看和管理所有项目数据' : 'View and manage all project data'}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleCreate}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={18} />
            {lang === 'zh' ? '添加项目' : 'Add Project'}
          </button>
          <button
            onClick={handleSync}
            disabled={isSyncing}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <RefreshCw size={18} className={isSyncing ? 'animate-spin' : ''} />
            {lang === 'zh' ? '同步到TS' : 'Sync to TS'}
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder={lang === 'zh' ? '搜索项目...' : 'Search projects...'}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Category Filter */}
          <select
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="all">{lang === 'zh' ? '所有类别' : 'All Categories'}</option>
            <option value="web">Web</option>
            <option value="mobile">{lang === 'zh' ? '移动应用' : 'Mobile'}</option>
            <option value="desktop">{lang === 'zh' ? '桌面应用' : 'Desktop'}</option>
            <option value="other">{lang === 'zh' ? '其他' : 'Other'}</option>
          </select>

          {/* Status Filter */}
          <select
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">{lang === 'zh' ? '所有状态' : 'All Status'}</option>
            <option value="completed">{lang === 'zh' ? '已完成' : 'Completed'}</option>
            <option value="in-progress">{lang === 'zh' ? '进行中' : 'In Progress'}</option>
            <option value="planned">{lang === 'zh' ? '计划中' : 'Planned'}</option>
          </select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="text-sm text-gray-600">{lang === 'zh' ? '总项目数' : 'Total Projects'}</div>
          <div className="text-2xl font-bold text-gray-800 mt-1">{projects.length}</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="text-sm text-gray-600">{lang === 'zh' ? '已完成' : 'Completed'}</div>
          <div className="text-2xl font-bold text-green-600 mt-1">
            {projects.filter(p => p.status === 'completed').length}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="text-sm text-gray-600">{lang === 'zh' ? '进行中' : 'In Progress'}</div>
          <div className="text-2xl font-bold text-blue-600 mt-1">
            {projects.filter(p => p.status === 'in-progress').length}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="text-sm text-gray-600">{lang === 'zh' ? '计划中' : 'Planned'}</div>
          <div className="text-2xl font-bold text-gray-600 mt-1">
            {projects.filter(p => p.status === 'planned').length}
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map(project => (
          <div key={project.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6 relative group">
            {/* Action Buttons */}
            <div className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => handleEdit(project)}
                className="p-2 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors"
                title={lang === 'zh' ? '编辑' : 'Edit'}
              >
                <Edit size={16} />
              </button>
              <button
                onClick={() => handleDelete(project)}
                className="p-2 bg-red-50 text-red-600 rounded hover:bg-red-100 transition-colors"
                title={lang === 'zh' ? '删除' : 'Delete'}
              >
                <Trash2 size={16} />
              </button>
            </div>

            {/* Header */}
            <div className="flex items-start justify-between mb-3 pr-16">
              <h3 className="text-lg font-semibold text-gray-800 flex-1">{project.title}</h3>
              {getStatusBadge(project.status)}
            </div>

            {/* Description */}
            <p className="text-sm text-gray-600 mb-4 line-clamp-3">{project.description}</p>

            {/* Meta Info */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center text-xs text-gray-500">
                <Filter size={14} className="mr-2" />
                {getCategoryLabel(project.category)}
              </div>
              <div className="flex items-center text-xs text-gray-500">
                <Calendar size={14} className="mr-2" />
                {project.startDate} {project.endDate && `- ${project.endDate}`}
              </div>
            </div>

            {/* Tech Stack */}
            <div className="flex flex-wrap gap-1 mb-4">
              {project.techStack.slice(0, 4).map((tech, idx) => (
                <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                  {tech}
                </span>
              ))}
              {project.techStack.length > 4 && (
                <span className="px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded">
                  +{project.techStack.length - 4}
                </span>
              )}
            </div>

            {/* Links */}
            <div className="flex gap-2">
              {project.liveDemo && (
                <a
                  href={project.liveDemo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700"
                >
                  <ExternalLink size={14} />
                  {lang === 'zh' ? '演示' : 'Demo'}
                </a>
              )}
              {project.sourceCode && (
                <a
                  href={project.sourceCode}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs text-gray-700 hover:text-gray-900"
                >
                  <Github size={14} />
                  {lang === 'zh' ? '源码' : 'Code'}
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredProjects.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">
            {lang === 'zh' ? '没有找到匹配的项目' : 'No projects found'}
          </p>
        </div>
      )}

      {/* Edit Modal */}
      <EditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title={editingProject 
          ? (lang === 'zh' ? '编辑项目' : 'Edit Project')
          : (lang === 'zh' ? '添加项目' : 'Add Project')
        }
        size="xlarge"
      >
        <ProjectForm
          project={editingProject}
          onSave={handleSave}
          onCancel={() => setIsEditModalOpen(false)}
        />
      </EditModal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onConfirm={confirmDelete}
        onCancel={() => setIsDeleteDialogOpen(false)}
        title={lang === 'zh' ? '确认删除' : 'Confirm Delete'}
        message={`${lang === 'zh' ? '确定要删除项目' : 'Are you sure you want to delete'} "${deletingProject?.title}"? ${lang === 'zh' ? '此操作无法撤销。' : 'This action cannot be undone.'}`}
        confirmText={lang === 'zh' ? '删除' : 'Delete'}
        danger={true}
      />
    </div>
  );
}
