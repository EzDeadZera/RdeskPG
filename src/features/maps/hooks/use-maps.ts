import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createMap,
  createWaypoint,
  deleteMap,
  deleteWaypoint,
  getMap,
  listMaps,
  listWaypoints,
  updateWaypoint,
} from '@/features/maps/services/map-service'
import type { MapInput, WaypointInput } from '@/features/maps/schemas'

export function useMaps(campaignId: string) {
  return useQuery({ queryKey: ['maps', campaignId], queryFn: () => listMaps(campaignId) })
}

export function useMap(id: string | undefined) {
  return useQuery({ queryKey: ['maps', 'one', id], queryFn: () => getMap(id as string), enabled: Boolean(id) })
}

export function useCreateMap(campaignId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: MapInput) => createMap(campaignId, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['maps', campaignId] }),
  })
}

export function useDeleteMap(campaignId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteMap(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['maps', campaignId] }),
  })
}

export function useWaypoints(mapId: string) {
  return useQuery({ queryKey: ['waypoints', mapId], queryFn: () => listWaypoints(mapId) })
}

export function useCreateWaypoint(mapId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ posX, posY, input }: { posX: number; posY: number; input: WaypointInput }) =>
      createWaypoint(mapId, posX, posY, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['waypoints', mapId] }),
  })
}

export function useUpdateWaypoint(mapId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: WaypointInput }) => updateWaypoint(id, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['waypoints', mapId] }),
  })
}

export function useDeleteWaypoint(mapId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteWaypoint(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['waypoints', mapId] }),
  })
}
