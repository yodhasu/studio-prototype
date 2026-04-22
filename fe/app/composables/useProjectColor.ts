import { useWorkspaceStore } from '~/stores/workspace'

export const useProjectColor = () => {
  const workspace = useWorkspaceStore()

  const getProject = (projectId?: string) =>
    projectId ? workspace.projects.find(p => p.id === projectId) || null : null

  const getColor = (projectId?: string) => getProject(projectId)?.color_code || 'rgb(var(--c-border))'

  const chipStyle = (projectId?: string) => {
    const color = getProject(projectId)?.color_code
    return color ? { backgroundColor: `${color}20`, color, borderColor: `${color}40` } : undefined
  }

  const dotStyle = (projectId?: string) => ({ backgroundColor: getColor(projectId) })

  const chipTone = (projectId?: string) => getProject(projectId)?.color_code || 'rgb(var(--c-border))'

  return { getProject, getColor, chipStyle, dotStyle, chipTone }
}
