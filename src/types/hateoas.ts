/**
 * Tipos para las respuestas HATEOAS que devuelve el backend de Spring.
 *
 * El backend envuelve cada recurso individual en un `EntityModel<T>` y
 * cada colección en un `CollectionModel<EntityModel<T>>`. En formato HAL/JSON
 * eso se traduce a:
 *
 *   // Recurso individual (EntityModel<T>):
 *   {
 *     "campo1": "valor",
 *     "campo2": "valor",
 *     "_links": {
 *       "self": { "href": "http://..." },
 *       "otraRel": { "href": "http://..." }
 *     }
 *   }
 *
 *   // Colección (CollectionModel<EntityModel<T>>):
 *   {
 *     "_embedded": {
 *       "estudiantes": [
 *         { "cedula": "...", "_links": { "self": { ... } } },
 *         ...
 *       ]
 *     },
 *     "_links": { "self": { "href": "..." } }
 *   }
 */

/** Un link HATEOAS: lo mínimo es el `href`, el resto es opcional. */
export interface HateoasLink {
  href: string
  hreflang?: string
  title?: string
  type?: string
  templated?: boolean
  deprecation?: string
  name?: string
  profile?: string
}

/** Bloque `_links` de una respuesta HATEOAS: mapa de rel → HateoasLink. */
export type HateoasLinks = Record<string, HateoasLink | undefined>

/**
 * T envuelto en EntityModel: conserva los campos de T y agrega un
 * bloque `_links` opcional. Se usa como tipo de retorno de los endpoints
 * de recurso individual (ej. /estudiantes/{cedula}, /estudiantes/{cedula}/notas).
 */
export type EntityModelResponse<T> = T & {
  _links?: HateoasLinks
}

/**
 * Respuesta HATEOAS de colección (CollectionModel<EntityModel<T>>):
 * tiene un `_embedded` con la lista de recursos y un `_links` con
 * links de navegación (al menos `self`).
 */
export interface CollectionModelResponse<T> {
  _embedded?: Record<string, T[]>
  _links?: HateoasLinks
}

/**
 * Helper para extraer la lista de recursos de una CollectionModelResponse.
 * El backend anida los elementos bajo la "relación" configurada en el DTO
 * (ej. "estudiantes", "materias", "notas", "promediosMaterias").
 */
export function extractCollection<T>(
  response: CollectionModelResponse<EntityModelResponse<T>>,
  relation: string,
): T[] {
  return response._embedded?.[relation] ?? []
}
