export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      admins_conjuntos: {
        Row: {
          activo: boolean | null
          conjunto_id: string
          es_propietario: boolean | null
          fecha_asignacion: string | null
          id: string
          permisos: Json | null
          user_id: string
        }
        Insert: {
          activo?: boolean | null
          conjunto_id: string
          es_propietario?: boolean | null
          fecha_asignacion?: string | null
          id?: string
          permisos?: Json | null
          user_id: string
        }
        Update: {
          activo?: boolean | null
          conjunto_id?: string
          es_propietario?: boolean | null
          fecha_asignacion?: string | null
          id?: string
          permisos?: Json | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_admins_conjuntos_conjunto"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "conjuntos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_admins_conjuntos_conjunto"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_asignacion_suscripciones"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "fk_admins_conjuntos_conjunto"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_configuracion_actual"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "fk_admins_conjuntos_conjunto"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_conjuntos_admin"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "fk_admins_conjuntos_conjunto"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_dashbard_admin"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "fk_admins_conjuntos_conjunto"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_dashboard_residente"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "fk_admins_conjuntos_conjunto"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_editar_conjunto"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_admins_conjuntos_conjunto"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_gestion_conjuntos"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "fk_admins_conjuntos_conjunto"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_mis_conjuntos"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "fk_admins_conjuntos_conjunto"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_mis_conjuntos_administracion"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "fk_admins_conjuntos_conjunto"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_mis_conjuntos_con_suscripcion"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "fk_admins_conjuntos_conjunto"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_mis_conjuntos_seleccion"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "fk_admins_conjuntos_conjunto"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_pagos_detalle"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "fk_admins_conjuntos_user"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_admins_conjuntos_user"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "vista_asignacion_suscripciones"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "fk_admins_conjuntos_user"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "vista_conjuntos_admin"
            referencedColumns: ["admin_id"]
          },
          {
            foreignKeyName: "fk_admins_conjuntos_user"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "vista_detalle_admin"
            referencedColumns: ["admin_id"]
          },
          {
            foreignKeyName: "fk_admins_conjuntos_user"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "vista_miembros_admin"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "fk_admins_conjuntos_user"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "vista_mis_balances_indicadores"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "fk_admins_conjuntos_user"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "vista_mis_residentes"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "fk_admins_conjuntos_user"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "vista_perfil"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "fk_admins_conjuntos_user"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "vista_perfil_administracion"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "fk_admins_conjuntos_user"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "vista_residentes_por_apartamento"
            referencedColumns: ["user_id"]
          },
        ]
      }
      apartamentos: {
        Row: {
          conjunto_id: string
          created_at: string | null
          direccion: string
          generado_automatico: boolean
          id: string
          numero_apartamento: string
          numero_apartamento_num: number | null
          ocupado: boolean
          torre_id: string | null
          torre_piso_id: string | null
          updated_at: string | null
        }
        Insert: {
          conjunto_id: string
          created_at?: string | null
          direccion: string
          generado_automatico?: boolean
          id?: string
          numero_apartamento: string
          numero_apartamento_num?: number | null
          ocupado?: boolean
          torre_id?: string | null
          torre_piso_id?: string | null
          updated_at?: string | null
        }
        Update: {
          conjunto_id?: string
          created_at?: string | null
          direccion?: string
          generado_automatico?: boolean
          id?: string
          numero_apartamento?: string
          numero_apartamento_num?: number | null
          ocupado?: boolean
          torre_id?: string | null
          torre_piso_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "apt_conjunto_fk"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "conjuntos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "apt_conjunto_fk"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_asignacion_suscripciones"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "apt_conjunto_fk"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_configuracion_actual"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "apt_conjunto_fk"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_conjuntos_admin"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "apt_conjunto_fk"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_dashbard_admin"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "apt_conjunto_fk"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_dashboard_residente"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "apt_conjunto_fk"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_editar_conjunto"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "apt_conjunto_fk"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_gestion_conjuntos"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "apt_conjunto_fk"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_mis_conjuntos"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "apt_conjunto_fk"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_mis_conjuntos_administracion"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "apt_conjunto_fk"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_mis_conjuntos_con_suscripcion"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "apt_conjunto_fk"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_mis_conjuntos_seleccion"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "apt_conjunto_fk"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_pagos_detalle"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "apt_torre_fk"
            columns: ["torre_id"]
            isOneToOne: false
            referencedRelation: "torres"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "apt_torre_fk"
            columns: ["torre_id"]
            isOneToOne: false
            referencedRelation: "vista_apartamentos_recepcion"
            referencedColumns: ["torre_id"]
          },
          {
            foreignKeyName: "apt_torre_fk"
            columns: ["torre_id"]
            isOneToOne: false
            referencedRelation: "vista_envios_recepcion"
            referencedColumns: ["torre_id"]
          },
          {
            foreignKeyName: "apt_torre_fk"
            columns: ["torre_id"]
            isOneToOne: false
            referencedRelation: "vista_gestion_torres"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "apt_torre_fk"
            columns: ["torre_id"]
            isOneToOne: false
            referencedRelation: "vista_visitas_recepcion"
            referencedColumns: ["torre_id"]
          },
          {
            foreignKeyName: "apt_torre_piso_fk"
            columns: ["torre_piso_id"]
            isOneToOne: false
            referencedRelation: "torre_pisos"
            referencedColumns: ["id"]
          },
        ]
      }
      areas_comunes: {
        Row: {
          activa: boolean
          conjunto_id: string
          created_at: string | null
          descripcion: string | null
          id: string
          nombre: string
        }
        Insert: {
          activa?: boolean
          conjunto_id: string
          created_at?: string | null
          descripcion?: string | null
          id?: string
          nombre: string
        }
        Update: {
          activa?: boolean
          conjunto_id?: string
          created_at?: string | null
          descripcion?: string | null
          id?: string
          nombre?: string
        }
        Relationships: [
          {
            foreignKeyName: "areas_conjuntos_fk"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "conjuntos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "areas_conjuntos_fk"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_asignacion_suscripciones"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "areas_conjuntos_fk"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_configuracion_actual"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "areas_conjuntos_fk"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_conjuntos_admin"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "areas_conjuntos_fk"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_dashbard_admin"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "areas_conjuntos_fk"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_dashboard_residente"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "areas_conjuntos_fk"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_editar_conjunto"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "areas_conjuntos_fk"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_gestion_conjuntos"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "areas_conjuntos_fk"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_mis_conjuntos"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "areas_conjuntos_fk"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_mis_conjuntos_administracion"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "areas_conjuntos_fk"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_mis_conjuntos_con_suscripcion"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "areas_conjuntos_fk"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_mis_conjuntos_seleccion"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "areas_conjuntos_fk"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_pagos_detalle"
            referencedColumns: ["conjunto_id"]
          },
        ]
      }
      audit_logs: {
        Row: {
          accion: string
          datos_anteriores: Json | null
          datos_nuevos: Json | null
          id: string
          ip_address: unknown
          registro_id: string
          tabla_afectada: string
          timestamp: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          accion: string
          datos_anteriores?: Json | null
          datos_nuevos?: Json | null
          id?: string
          ip_address?: unknown
          registro_id: string
          tabla_afectada: string
          timestamp?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          accion?: string
          datos_anteriores?: Json | null
          datos_nuevos?: Json | null
          id?: string
          ip_address?: unknown
          registro_id?: string
          tabla_afectada?: string
          timestamp?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_user_fk"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "audit_logs_user_fk"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "vista_asignacion_suscripciones"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "audit_logs_user_fk"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "vista_conjuntos_admin"
            referencedColumns: ["admin_id"]
          },
          {
            foreignKeyName: "audit_logs_user_fk"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "vista_detalle_admin"
            referencedColumns: ["admin_id"]
          },
          {
            foreignKeyName: "audit_logs_user_fk"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "vista_miembros_admin"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "audit_logs_user_fk"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "vista_mis_balances_indicadores"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "audit_logs_user_fk"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "vista_mis_residentes"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "audit_logs_user_fk"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "vista_perfil"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "audit_logs_user_fk"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "vista_perfil_administracion"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "audit_logs_user_fk"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "vista_residentes_por_apartamento"
            referencedColumns: ["user_id"]
          },
        ]
      }
      cargas_recaudos: {
        Row: {
          archivo_nombre: string | null
          archivo_path: string
          conjunto_id: string
          creado_en: string
          creado_por: string | null
          detalles: Json
          errores: number
          id: string
          insertados: number
          periodo: string
          procesadas: number
        }
        Insert: {
          archivo_nombre?: string | null
          archivo_path: string
          conjunto_id: string
          creado_en?: string
          creado_por?: string | null
          detalles?: Json
          errores?: number
          id?: string
          insertados?: number
          periodo: string
          procesadas?: number
        }
        Update: {
          archivo_nombre?: string | null
          archivo_path?: string
          conjunto_id?: string
          creado_en?: string
          creado_por?: string | null
          detalles?: Json
          errores?: number
          id?: string
          insertados?: number
          periodo?: string
          procesadas?: number
        }
        Relationships: [
          {
            foreignKeyName: "cargas_recaudos_conjunto_id_fkey"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "conjuntos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cargas_recaudos_conjunto_id_fkey"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_asignacion_suscripciones"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "cargas_recaudos_conjunto_id_fkey"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_configuracion_actual"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "cargas_recaudos_conjunto_id_fkey"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_conjuntos_admin"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "cargas_recaudos_conjunto_id_fkey"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_dashbard_admin"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "cargas_recaudos_conjunto_id_fkey"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_dashboard_residente"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "cargas_recaudos_conjunto_id_fkey"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_editar_conjunto"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cargas_recaudos_conjunto_id_fkey"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_gestion_conjuntos"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "cargas_recaudos_conjunto_id_fkey"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_mis_conjuntos"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "cargas_recaudos_conjunto_id_fkey"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_mis_conjuntos_administracion"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "cargas_recaudos_conjunto_id_fkey"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_mis_conjuntos_con_suscripcion"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "cargas_recaudos_conjunto_id_fkey"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_mis_conjuntos_seleccion"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "cargas_recaudos_conjunto_id_fkey"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_pagos_detalle"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "cargas_recaudos_creado_por_fkey"
            columns: ["creado_por"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cargas_recaudos_creado_por_fkey"
            columns: ["creado_por"]
            isOneToOne: false
            referencedRelation: "vista_asignacion_suscripciones"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "cargas_recaudos_creado_por_fkey"
            columns: ["creado_por"]
            isOneToOne: false
            referencedRelation: "vista_conjuntos_admin"
            referencedColumns: ["admin_id"]
          },
          {
            foreignKeyName: "cargas_recaudos_creado_por_fkey"
            columns: ["creado_por"]
            isOneToOne: false
            referencedRelation: "vista_detalle_admin"
            referencedColumns: ["admin_id"]
          },
          {
            foreignKeyName: "cargas_recaudos_creado_por_fkey"
            columns: ["creado_por"]
            isOneToOne: false
            referencedRelation: "vista_miembros_admin"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "cargas_recaudos_creado_por_fkey"
            columns: ["creado_por"]
            isOneToOne: false
            referencedRelation: "vista_mis_balances_indicadores"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "cargas_recaudos_creado_por_fkey"
            columns: ["creado_por"]
            isOneToOne: false
            referencedRelation: "vista_mis_residentes"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "cargas_recaudos_creado_por_fkey"
            columns: ["creado_por"]
            isOneToOne: false
            referencedRelation: "vista_perfil"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "cargas_recaudos_creado_por_fkey"
            columns: ["creado_por"]
            isOneToOne: false
            referencedRelation: "vista_perfil_administracion"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "cargas_recaudos_creado_por_fkey"
            columns: ["creado_por"]
            isOneToOne: false
            referencedRelation: "vista_residentes_por_apartamento"
            referencedColumns: ["user_id"]
          },
        ]
      }
      cargos_mensuales: {
        Row: {
          apartamento_id: string
          concepto_id: string
          conjunto_id: string
          fecha_generado: string | null
          fecha_vencimiento: string | null
          id: string
          link_pago: string | null
          origen: string
          periodo: string
          residente_id: string | null
          solicitud_id: string | null
          valor_base: number
          valor_descuento: number | null
          valor_final: number
        }
        Insert: {
          apartamento_id: string
          concepto_id: string
          conjunto_id: string
          fecha_generado?: string | null
          fecha_vencimiento?: string | null
          id?: string
          link_pago?: string | null
          origen?: string
          periodo: string
          residente_id?: string | null
          solicitud_id?: string | null
          valor_base: number
          valor_descuento?: number | null
          valor_final: number
        }
        Update: {
          apartamento_id?: string
          concepto_id?: string
          conjunto_id?: string
          fecha_generado?: string | null
          fecha_vencimiento?: string | null
          id?: string
          link_pago?: string | null
          origen?: string
          periodo?: string
          residente_id?: string | null
          solicitud_id?: string | null
          valor_base?: number
          valor_descuento?: number | null
          valor_final?: number
        }
        Relationships: [
          {
            foreignKeyName: "cargos_concepto_fk"
            columns: ["concepto_id"]
            isOneToOne: false
            referencedRelation: "conceptos_cobro"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cargos_concepto_fk"
            columns: ["concepto_id"]
            isOneToOne: false
            referencedRelation: "vista_saldos_por_concepto_residente"
            referencedColumns: ["concepto_id"]
          },
          {
            foreignKeyName: "cargos_mensuales_apartamento_id_fkey"
            columns: ["apartamento_id"]
            isOneToOne: false
            referencedRelation: "apartamentos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cargos_mensuales_apartamento_id_fkey"
            columns: ["apartamento_id"]
            isOneToOne: false
            referencedRelation: "vista_apartamentos_recepcion"
            referencedColumns: ["apartamento_id"]
          },
          {
            foreignKeyName: "cargos_mensuales_apartamento_id_fkey"
            columns: ["apartamento_id"]
            isOneToOne: false
            referencedRelation: "vista_dashboard_residente"
            referencedColumns: ["apartamento_id"]
          },
          {
            foreignKeyName: "cargos_mensuales_apartamento_id_fkey"
            columns: ["apartamento_id"]
            isOneToOne: false
            referencedRelation: "vista_detalle_apt"
            referencedColumns: ["id_apt"]
          },
          {
            foreignKeyName: "cargos_mensuales_apartamento_id_fkey"
            columns: ["apartamento_id"]
            isOneToOne: false
            referencedRelation: "vista_envios_recepcion"
            referencedColumns: ["apartamento_id"]
          },
          {
            foreignKeyName: "cargos_mensuales_apartamento_id_fkey"
            columns: ["apartamento_id"]
            isOneToOne: false
            referencedRelation: "vista_mis_balances_indicadores"
            referencedColumns: ["apartamento_id"]
          },
          {
            foreignKeyName: "cargos_mensuales_apartamento_id_fkey"
            columns: ["apartamento_id"]
            isOneToOne: false
            referencedRelation: "vista_mis_residentes"
            referencedColumns: ["apartamento_id"]
          },
          {
            foreignKeyName: "cargos_mensuales_apartamento_id_fkey"
            columns: ["apartamento_id"]
            isOneToOne: false
            referencedRelation: "vista_visitas_recepcion"
            referencedColumns: ["apartamento_id"]
          },
          {
            foreignKeyName: "cargos_mensuales_conjunto_id_fkey"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "conjuntos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cargos_mensuales_conjunto_id_fkey"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_asignacion_suscripciones"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "cargos_mensuales_conjunto_id_fkey"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_configuracion_actual"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "cargos_mensuales_conjunto_id_fkey"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_conjuntos_admin"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "cargos_mensuales_conjunto_id_fkey"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_dashbard_admin"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "cargos_mensuales_conjunto_id_fkey"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_dashboard_residente"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "cargos_mensuales_conjunto_id_fkey"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_editar_conjunto"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cargos_mensuales_conjunto_id_fkey"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_gestion_conjuntos"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "cargos_mensuales_conjunto_id_fkey"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_mis_conjuntos"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "cargos_mensuales_conjunto_id_fkey"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_mis_conjuntos_administracion"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "cargos_mensuales_conjunto_id_fkey"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_mis_conjuntos_con_suscripcion"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "cargos_mensuales_conjunto_id_fkey"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_mis_conjuntos_seleccion"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "cargos_mensuales_conjunto_id_fkey"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_pagos_detalle"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "cargos_mensuales_residente_id_fkey"
            columns: ["residente_id"]
            isOneToOne: false
            referencedRelation: "residentes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cargos_mensuales_residente_id_fkey"
            columns: ["residente_id"]
            isOneToOne: false
            referencedRelation: "vista_gestion_solicitudes"
            referencedColumns: ["id_residente"]
          },
          {
            foreignKeyName: "cargos_mensuales_residente_id_fkey"
            columns: ["residente_id"]
            isOneToOne: false
            referencedRelation: "vista_mis_balances_indicadores"
            referencedColumns: ["residente_id"]
          },
          {
            foreignKeyName: "cargos_mensuales_residente_id_fkey"
            columns: ["residente_id"]
            isOneToOne: false
            referencedRelation: "vista_mis_residentes"
            referencedColumns: ["residente_id"]
          },
          {
            foreignKeyName: "cargos_mensuales_residente_id_fkey"
            columns: ["residente_id"]
            isOneToOne: false
            referencedRelation: "vista_residente_completo"
            referencedColumns: ["residente_id"]
          },
          {
            foreignKeyName: "cargos_mensuales_residente_id_fkey"
            columns: ["residente_id"]
            isOneToOne: false
            referencedRelation: "vista_residentes_por_apartamento"
            referencedColumns: ["residente_id"]
          },
          {
            foreignKeyName: "cargos_mensuales_residente_id_fkey"
            columns: ["residente_id"]
            isOneToOne: false
            referencedRelation: "vista_saldos_por_concepto_residente"
            referencedColumns: ["residente_id"]
          },
          {
            foreignKeyName: "cargos_mensuales_solicitud_id_fkey"
            columns: ["solicitud_id"]
            isOneToOne: false
            referencedRelation: "solicitudes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cargos_mensuales_solicitud_id_fkey"
            columns: ["solicitud_id"]
            isOneToOne: false
            referencedRelation: "vista_detalle_solicitud"
            referencedColumns: ["id_solicitud"]
          },
          {
            foreignKeyName: "cargos_mensuales_solicitud_id_fkey"
            columns: ["solicitud_id"]
            isOneToOne: false
            referencedRelation: "vista_gestion_solicitudes"
            referencedColumns: ["id_solicitud"]
          },
          {
            foreignKeyName: "cargos_mensuales_solicitud_id_fkey"
            columns: ["solicitud_id"]
            isOneToOne: false
            referencedRelation: "vista_gestion_solicitudes_detalle"
            referencedColumns: ["id_solicitud"]
          },
          {
            foreignKeyName: "cargos_mensuales_solicitud_id_fkey"
            columns: ["solicitud_id"]
            isOneToOne: false
            referencedRelation: "vista_mis_solicitudes"
            referencedColumns: ["id_solicitud"]
          },
        ]
      }
      cargos_recaudos: {
        Row: {
          cargo_id: string
          id: string
          recaudo_id: string
          valor_aplicado: number
        }
        Insert: {
          cargo_id: string
          id?: string
          recaudo_id: string
          valor_aplicado: number
        }
        Update: {
          cargo_id?: string
          id?: string
          recaudo_id?: string
          valor_aplicado?: number
        }
        Relationships: [
          {
            foreignKeyName: "cargos_recaudos_cargo_id_fkey"
            columns: ["cargo_id"]
            isOneToOne: false
            referencedRelation: "cargos_mensuales"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cargos_recaudos_recaudo_id_fkey"
            columns: ["recaudo_id"]
            isOneToOne: false
            referencedRelation: "recaudos"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_messages: {
        Row: {
          chat_id: string
          content: string | null
          created_at: string | null
          file_name: string | null
          id: string
          message_type: string
          sender_id: string
        }
        Insert: {
          chat_id: string
          content?: string | null
          created_at?: string | null
          file_name?: string | null
          id?: string
          message_type: string
          sender_id: string
        }
        Update: {
          chat_id?: string
          content?: string | null
          created_at?: string | null
          file_name?: string | null
          id?: string
          message_type?: string
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_chat_id_fkey"
            columns: ["chat_id"]
            isOneToOne: false
            referencedRelation: "chats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_messages_chat_id_fkey"
            columns: ["chat_id"]
            isOneToOne: false
            referencedRelation: "vista_chats_usuario"
            referencedColumns: ["chat_id"]
          },
          {
            foreignKeyName: "chat_messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "vista_asignacion_suscripciones"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "chat_messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "vista_conjuntos_admin"
            referencedColumns: ["admin_id"]
          },
          {
            foreignKeyName: "chat_messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "vista_detalle_admin"
            referencedColumns: ["admin_id"]
          },
          {
            foreignKeyName: "chat_messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "vista_miembros_admin"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "chat_messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "vista_mis_balances_indicadores"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "chat_messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "vista_mis_residentes"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "chat_messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "vista_perfil"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "chat_messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "vista_perfil_administracion"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "chat_messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "vista_residentes_por_apartamento"
            referencedColumns: ["user_id"]
          },
        ]
      }
      chats: {
        Row: {
          admin_ultima_lectura: string | null
          asunto: string
          conjunto_id: string
          created_at: string | null
          estado: Database["public"]["Enums"]["chat_estado_enum"]
          id: string
          receptor_id: string | null
          residente_id: string
          residente_ultima_lectura: string | null
          updated_at: string | null
        }
        Insert: {
          admin_ultima_lectura?: string | null
          asunto: string
          conjunto_id: string
          created_at?: string | null
          estado?: Database["public"]["Enums"]["chat_estado_enum"]
          id?: string
          receptor_id?: string | null
          residente_id: string
          residente_ultima_lectura?: string | null
          updated_at?: string | null
        }
        Update: {
          admin_ultima_lectura?: string | null
          asunto?: string
          conjunto_id?: string
          created_at?: string | null
          estado?: Database["public"]["Enums"]["chat_estado_enum"]
          id?: string
          receptor_id?: string | null
          residente_id?: string
          residente_ultima_lectura?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chats_conjunto_id_fkey"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "conjuntos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chats_conjunto_id_fkey"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_asignacion_suscripciones"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "chats_conjunto_id_fkey"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_configuracion_actual"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "chats_conjunto_id_fkey"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_conjuntos_admin"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "chats_conjunto_id_fkey"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_dashbard_admin"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "chats_conjunto_id_fkey"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_dashboard_residente"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "chats_conjunto_id_fkey"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_editar_conjunto"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chats_conjunto_id_fkey"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_gestion_conjuntos"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "chats_conjunto_id_fkey"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_mis_conjuntos"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "chats_conjunto_id_fkey"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_mis_conjuntos_administracion"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "chats_conjunto_id_fkey"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_mis_conjuntos_con_suscripcion"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "chats_conjunto_id_fkey"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_mis_conjuntos_seleccion"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "chats_conjunto_id_fkey"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_pagos_detalle"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "chats_receptor_id_fkey"
            columns: ["receptor_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chats_receptor_id_fkey"
            columns: ["receptor_id"]
            isOneToOne: false
            referencedRelation: "vista_asignacion_suscripciones"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "chats_receptor_id_fkey"
            columns: ["receptor_id"]
            isOneToOne: false
            referencedRelation: "vista_conjuntos_admin"
            referencedColumns: ["admin_id"]
          },
          {
            foreignKeyName: "chats_receptor_id_fkey"
            columns: ["receptor_id"]
            isOneToOne: false
            referencedRelation: "vista_detalle_admin"
            referencedColumns: ["admin_id"]
          },
          {
            foreignKeyName: "chats_receptor_id_fkey"
            columns: ["receptor_id"]
            isOneToOne: false
            referencedRelation: "vista_miembros_admin"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "chats_receptor_id_fkey"
            columns: ["receptor_id"]
            isOneToOne: false
            referencedRelation: "vista_mis_balances_indicadores"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "chats_receptor_id_fkey"
            columns: ["receptor_id"]
            isOneToOne: false
            referencedRelation: "vista_mis_residentes"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "chats_receptor_id_fkey"
            columns: ["receptor_id"]
            isOneToOne: false
            referencedRelation: "vista_perfil"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "chats_receptor_id_fkey"
            columns: ["receptor_id"]
            isOneToOne: false
            referencedRelation: "vista_perfil_administracion"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "chats_receptor_id_fkey"
            columns: ["receptor_id"]
            isOneToOne: false
            referencedRelation: "vista_residentes_por_apartamento"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "chats_residente_id_fkey"
            columns: ["residente_id"]
            isOneToOne: false
            referencedRelation: "residentes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chats_residente_id_fkey"
            columns: ["residente_id"]
            isOneToOne: false
            referencedRelation: "vista_gestion_solicitudes"
            referencedColumns: ["id_residente"]
          },
          {
            foreignKeyName: "chats_residente_id_fkey"
            columns: ["residente_id"]
            isOneToOne: false
            referencedRelation: "vista_mis_balances_indicadores"
            referencedColumns: ["residente_id"]
          },
          {
            foreignKeyName: "chats_residente_id_fkey"
            columns: ["residente_id"]
            isOneToOne: false
            referencedRelation: "vista_mis_residentes"
            referencedColumns: ["residente_id"]
          },
          {
            foreignKeyName: "chats_residente_id_fkey"
            columns: ["residente_id"]
            isOneToOne: false
            referencedRelation: "vista_residente_completo"
            referencedColumns: ["residente_id"]
          },
          {
            foreignKeyName: "chats_residente_id_fkey"
            columns: ["residente_id"]
            isOneToOne: false
            referencedRelation: "vista_residentes_por_apartamento"
            referencedColumns: ["residente_id"]
          },
          {
            foreignKeyName: "chats_residente_id_fkey"
            columns: ["residente_id"]
            isOneToOne: false
            referencedRelation: "vista_saldos_por_concepto_residente"
            referencedColumns: ["residente_id"]
          },
        ]
      }
      comunicados: {
        Row: {
          adjunto: string | null
          apartamento_id: string | null
          conjunto_id: string
          creado_por: string | null
          descripcion: string | null
          fecha_publicacion: string | null
          id: string
          tipo: Database["public"]["Enums"]["tipo_comunicado_enum"]
          tipo_novedad: Database["public"]["Enums"]["tipo_novedad_enum"]
          titulo: string
        }
        Insert: {
          adjunto?: string | null
          apartamento_id?: string | null
          conjunto_id: string
          creado_por?: string | null
          descripcion?: string | null
          fecha_publicacion?: string | null
          id?: string
          tipo?: Database["public"]["Enums"]["tipo_comunicado_enum"]
          tipo_novedad: Database["public"]["Enums"]["tipo_novedad_enum"]
          titulo: string
        }
        Update: {
          adjunto?: string | null
          apartamento_id?: string | null
          conjunto_id?: string
          creado_por?: string | null
          descripcion?: string | null
          fecha_publicacion?: string | null
          id?: string
          tipo?: Database["public"]["Enums"]["tipo_comunicado_enum"]
          tipo_novedad?: Database["public"]["Enums"]["tipo_novedad_enum"]
          titulo?: string
        }
        Relationships: [
          {
            foreignKeyName: "comunicados_apartamento_id_fkey"
            columns: ["apartamento_id"]
            isOneToOne: false
            referencedRelation: "apartamentos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comunicados_apartamento_id_fkey"
            columns: ["apartamento_id"]
            isOneToOne: false
            referencedRelation: "vista_apartamentos_recepcion"
            referencedColumns: ["apartamento_id"]
          },
          {
            foreignKeyName: "comunicados_apartamento_id_fkey"
            columns: ["apartamento_id"]
            isOneToOne: false
            referencedRelation: "vista_dashboard_residente"
            referencedColumns: ["apartamento_id"]
          },
          {
            foreignKeyName: "comunicados_apartamento_id_fkey"
            columns: ["apartamento_id"]
            isOneToOne: false
            referencedRelation: "vista_detalle_apt"
            referencedColumns: ["id_apt"]
          },
          {
            foreignKeyName: "comunicados_apartamento_id_fkey"
            columns: ["apartamento_id"]
            isOneToOne: false
            referencedRelation: "vista_envios_recepcion"
            referencedColumns: ["apartamento_id"]
          },
          {
            foreignKeyName: "comunicados_apartamento_id_fkey"
            columns: ["apartamento_id"]
            isOneToOne: false
            referencedRelation: "vista_mis_balances_indicadores"
            referencedColumns: ["apartamento_id"]
          },
          {
            foreignKeyName: "comunicados_apartamento_id_fkey"
            columns: ["apartamento_id"]
            isOneToOne: false
            referencedRelation: "vista_mis_residentes"
            referencedColumns: ["apartamento_id"]
          },
          {
            foreignKeyName: "comunicados_apartamento_id_fkey"
            columns: ["apartamento_id"]
            isOneToOne: false
            referencedRelation: "vista_visitas_recepcion"
            referencedColumns: ["apartamento_id"]
          },
          {
            foreignKeyName: "comunicados_conjunto_fk"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "conjuntos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comunicados_conjunto_fk"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_asignacion_suscripciones"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "comunicados_conjunto_fk"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_configuracion_actual"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "comunicados_conjunto_fk"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_conjuntos_admin"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "comunicados_conjunto_fk"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_dashbard_admin"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "comunicados_conjunto_fk"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_dashboard_residente"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "comunicados_conjunto_fk"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_editar_conjunto"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comunicados_conjunto_fk"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_gestion_conjuntos"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "comunicados_conjunto_fk"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_mis_conjuntos"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "comunicados_conjunto_fk"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_mis_conjuntos_administracion"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "comunicados_conjunto_fk"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_mis_conjuntos_con_suscripcion"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "comunicados_conjunto_fk"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_mis_conjuntos_seleccion"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "comunicados_conjunto_fk"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_pagos_detalle"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "comunicados_creado_por_fk"
            columns: ["creado_por"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comunicados_creado_por_fk"
            columns: ["creado_por"]
            isOneToOne: false
            referencedRelation: "vista_asignacion_suscripciones"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "comunicados_creado_por_fk"
            columns: ["creado_por"]
            isOneToOne: false
            referencedRelation: "vista_conjuntos_admin"
            referencedColumns: ["admin_id"]
          },
          {
            foreignKeyName: "comunicados_creado_por_fk"
            columns: ["creado_por"]
            isOneToOne: false
            referencedRelation: "vista_detalle_admin"
            referencedColumns: ["admin_id"]
          },
          {
            foreignKeyName: "comunicados_creado_por_fk"
            columns: ["creado_por"]
            isOneToOne: false
            referencedRelation: "vista_miembros_admin"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "comunicados_creado_por_fk"
            columns: ["creado_por"]
            isOneToOne: false
            referencedRelation: "vista_mis_balances_indicadores"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "comunicados_creado_por_fk"
            columns: ["creado_por"]
            isOneToOne: false
            referencedRelation: "vista_mis_residentes"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "comunicados_creado_por_fk"
            columns: ["creado_por"]
            isOneToOne: false
            referencedRelation: "vista_perfil"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "comunicados_creado_por_fk"
            columns: ["creado_por"]
            isOneToOne: false
            referencedRelation: "vista_perfil_administracion"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "comunicados_creado_por_fk"
            columns: ["creado_por"]
            isOneToOne: false
            referencedRelation: "vista_residentes_por_apartamento"
            referencedColumns: ["user_id"]
          },
        ]
      }
      conceptos_cobro: {
        Row: {
          activo: boolean
          aplica_descuento: boolean
          codigo: string
          conjunto_id: string
          creado_en: string | null
          descripcion: string | null
          es_recurrente: boolean
          id: string
          nombre: string
          porcentaje: number | null
          tipo_calculo: string
          valor: number
        }
        Insert: {
          activo?: boolean
          aplica_descuento?: boolean
          codigo: string
          conjunto_id: string
          creado_en?: string | null
          descripcion?: string | null
          es_recurrente?: boolean
          id?: string
          nombre: string
          porcentaje?: number | null
          tipo_calculo?: string
          valor?: number
        }
        Update: {
          activo?: boolean
          aplica_descuento?: boolean
          codigo?: string
          conjunto_id?: string
          creado_en?: string | null
          descripcion?: string | null
          es_recurrente?: boolean
          id?: string
          nombre?: string
          porcentaje?: number | null
          tipo_calculo?: string
          valor?: number
        }
        Relationships: [
          {
            foreignKeyName: "conceptos_conjunto_fk"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "conjuntos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conceptos_conjunto_fk"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_asignacion_suscripciones"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "conceptos_conjunto_fk"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_configuracion_actual"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "conceptos_conjunto_fk"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_conjuntos_admin"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "conceptos_conjunto_fk"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_dashbard_admin"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "conceptos_conjunto_fk"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_dashboard_residente"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "conceptos_conjunto_fk"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_editar_conjunto"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conceptos_conjunto_fk"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_gestion_conjuntos"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "conceptos_conjunto_fk"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_mis_conjuntos"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "conceptos_conjunto_fk"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_mis_conjuntos_administracion"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "conceptos_conjunto_fk"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_mis_conjuntos_con_suscripcion"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "conceptos_conjunto_fk"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_mis_conjuntos_seleccion"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "conceptos_conjunto_fk"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_pagos_detalle"
            referencedColumns: ["conjunto_id"]
          },
        ]
      }
      conjuntos: {
        Row: {
          activo: boolean | null
          anio_construccion: number | null
          ciudad: string | null
          codigo_municipio: string
          created_at: string | null
          direccion: string
          estado: string | null
          estrato: number | null
          foto_url: string | null
          id: string
          nombre: string
          tiene_torres: boolean
          tipo_vivienda: string
          updated_at: string | null
        }
        Insert: {
          activo?: boolean | null
          anio_construccion?: number | null
          ciudad?: string | null
          codigo_municipio: string
          created_at?: string | null
          direccion: string
          estado?: string | null
          estrato?: number | null
          foto_url?: string | null
          id?: string
          nombre: string
          tiene_torres?: boolean
          tipo_vivienda: string
          updated_at?: string | null
        }
        Update: {
          activo?: boolean | null
          anio_construccion?: number | null
          ciudad?: string | null
          codigo_municipio?: string
          created_at?: string | null
          direccion?: string
          estado?: string | null
          estrato?: number | null
          foto_url?: string | null
          id?: string
          nombre?: string
          tiene_torres?: boolean
          tipo_vivienda?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "conjuntos_ubicacion_fk"
            columns: ["codigo_municipio"]
            isOneToOne: false
            referencedRelation: "ubicaciones"
            referencedColumns: ["codigo_municipio"]
          },
          {
            foreignKeyName: "conjuntos_ubicacion_fk"
            columns: ["codigo_municipio"]
            isOneToOne: false
            referencedRelation: "vista_editar_conjunto"
            referencedColumns: ["codigo_ciudad"]
          },
        ]
      }
      conjuntos_configuracion: {
        Row: {
          actualizado_en: string | null
          conjunto_id: string
          creado_en: string | null
          id: string
          link_pago: string | null
          pronto_pago_dias: number | null
          pronto_pago_habilitado: boolean | null
          pronto_pago_porcentaje: number | null
          pronto_pago_tipo: string | null
          pronto_pago_valor: number | null
        }
        Insert: {
          actualizado_en?: string | null
          conjunto_id: string
          creado_en?: string | null
          id?: string
          link_pago?: string | null
          pronto_pago_dias?: number | null
          pronto_pago_habilitado?: boolean | null
          pronto_pago_porcentaje?: number | null
          pronto_pago_tipo?: string | null
          pronto_pago_valor?: number | null
        }
        Update: {
          actualizado_en?: string | null
          conjunto_id?: string
          creado_en?: string | null
          id?: string
          link_pago?: string | null
          pronto_pago_dias?: number | null
          pronto_pago_habilitado?: boolean | null
          pronto_pago_porcentaje?: number | null
          pronto_pago_tipo?: string | null
          pronto_pago_valor?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "conjuntos_configuracion_conjunto_id_fkey"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "conjuntos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conjuntos_configuracion_conjunto_id_fkey"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_asignacion_suscripciones"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "conjuntos_configuracion_conjunto_id_fkey"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_configuracion_actual"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "conjuntos_configuracion_conjunto_id_fkey"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_conjuntos_admin"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "conjuntos_configuracion_conjunto_id_fkey"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_dashbard_admin"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "conjuntos_configuracion_conjunto_id_fkey"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_dashboard_residente"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "conjuntos_configuracion_conjunto_id_fkey"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_editar_conjunto"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conjuntos_configuracion_conjunto_id_fkey"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_gestion_conjuntos"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "conjuntos_configuracion_conjunto_id_fkey"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_mis_conjuntos"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "conjuntos_configuracion_conjunto_id_fkey"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_mis_conjuntos_administracion"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "conjuntos_configuracion_conjunto_id_fkey"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_mis_conjuntos_con_suscripcion"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "conjuntos_configuracion_conjunto_id_fkey"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_mis_conjuntos_seleccion"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "conjuntos_configuracion_conjunto_id_fkey"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_pagos_detalle"
            referencedColumns: ["conjunto_id"]
          },
        ]
      }
      contactos: {
        Row: {
          apellido: string
          created_at: string | null
          descripcion: string | null
          email: string
          estado: string | null
          id: string
          nombre: string
          nombre_conjunto: string | null
          telefono: string | null
          tipo_solicitud: string
        }
        Insert: {
          apellido: string
          created_at?: string | null
          descripcion?: string | null
          email: string
          estado?: string | null
          id?: string
          nombre: string
          nombre_conjunto?: string | null
          telefono?: string | null
          tipo_solicitud: string
        }
        Update: {
          apellido?: string
          created_at?: string | null
          descripcion?: string | null
          email?: string
          estado?: string | null
          id?: string
          nombre?: string
          nombre_conjunto?: string | null
          telefono?: string | null
          tipo_solicitud?: string
        }
        Relationships: []
      }
      convivientes: {
        Row: {
          apellidos: string
          fecha_nacimiento: string | null
          id: number
          nombres: string
          parentesco: string
          residente_id: string
        }
        Insert: {
          apellidos: string
          fecha_nacimiento?: string | null
          id?: number
          nombres: string
          parentesco: string
          residente_id: string
        }
        Update: {
          apellidos?: string
          fecha_nacimiento?: string | null
          id?: number
          nombres?: string
          parentesco?: string
          residente_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "conviviente_res_fk"
            columns: ["residente_id"]
            isOneToOne: false
            referencedRelation: "residentes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conviviente_res_fk"
            columns: ["residente_id"]
            isOneToOne: false
            referencedRelation: "vista_gestion_solicitudes"
            referencedColumns: ["id_residente"]
          },
          {
            foreignKeyName: "conviviente_res_fk"
            columns: ["residente_id"]
            isOneToOne: false
            referencedRelation: "vista_mis_balances_indicadores"
            referencedColumns: ["residente_id"]
          },
          {
            foreignKeyName: "conviviente_res_fk"
            columns: ["residente_id"]
            isOneToOne: false
            referencedRelation: "vista_mis_residentes"
            referencedColumns: ["residente_id"]
          },
          {
            foreignKeyName: "conviviente_res_fk"
            columns: ["residente_id"]
            isOneToOne: false
            referencedRelation: "vista_residente_completo"
            referencedColumns: ["residente_id"]
          },
          {
            foreignKeyName: "conviviente_res_fk"
            columns: ["residente_id"]
            isOneToOne: false
            referencedRelation: "vista_residentes_por_apartamento"
            referencedColumns: ["residente_id"]
          },
          {
            foreignKeyName: "conviviente_res_fk"
            columns: ["residente_id"]
            isOneToOne: false
            referencedRelation: "vista_saldos_por_concepto_residente"
            referencedColumns: ["residente_id"]
          },
        ]
      }
      empleados_servicio: {
        Row: {
          apellidos: string | null
          cargo: string | null
          documento_ident: string
          id: number
          nombres: string
          residente_id: string
          tipo_documento: string
        }
        Insert: {
          apellidos?: string | null
          cargo?: string | null
          documento_ident: string
          id?: number
          nombres: string
          residente_id: string
          tipo_documento: string
        }
        Update: {
          apellidos?: string | null
          cargo?: string | null
          documento_ident?: string
          id?: number
          nombres?: string
          residente_id?: string
          tipo_documento?: string
        }
        Relationships: [
          {
            foreignKeyName: "empleado_res_fk"
            columns: ["residente_id"]
            isOneToOne: false
            referencedRelation: "residentes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "empleado_res_fk"
            columns: ["residente_id"]
            isOneToOne: false
            referencedRelation: "vista_gestion_solicitudes"
            referencedColumns: ["id_residente"]
          },
          {
            foreignKeyName: "empleado_res_fk"
            columns: ["residente_id"]
            isOneToOne: false
            referencedRelation: "vista_mis_balances_indicadores"
            referencedColumns: ["residente_id"]
          },
          {
            foreignKeyName: "empleado_res_fk"
            columns: ["residente_id"]
            isOneToOne: false
            referencedRelation: "vista_mis_residentes"
            referencedColumns: ["residente_id"]
          },
          {
            foreignKeyName: "empleado_res_fk"
            columns: ["residente_id"]
            isOneToOne: false
            referencedRelation: "vista_residente_completo"
            referencedColumns: ["residente_id"]
          },
          {
            foreignKeyName: "empleado_res_fk"
            columns: ["residente_id"]
            isOneToOne: false
            referencedRelation: "vista_residentes_por_apartamento"
            referencedColumns: ["residente_id"]
          },
          {
            foreignKeyName: "empleado_res_fk"
            columns: ["residente_id"]
            isOneToOne: false
            referencedRelation: "vista_saldos_por_concepto_residente"
            referencedColumns: ["residente_id"]
          },
        ]
      }
      envios: {
        Row: {
          apartamento_id: string
          empresa_mensajeria: string
          entregado_por: string | null
          estado: Database["public"]["Enums"]["estado_envio_enum"]
          fecha: string | null
          fecha_entrega: string | null
          id: string
          observaciones: string | null
          recibido_por: string | null
          registrado_por: string | null
        }
        Insert: {
          apartamento_id: string
          empresa_mensajeria: string
          entregado_por?: string | null
          estado?: Database["public"]["Enums"]["estado_envio_enum"]
          fecha?: string | null
          fecha_entrega?: string | null
          id?: string
          observaciones?: string | null
          recibido_por?: string | null
          registrado_por?: string | null
        }
        Update: {
          apartamento_id?: string
          empresa_mensajeria?: string
          entregado_por?: string | null
          estado?: Database["public"]["Enums"]["estado_envio_enum"]
          fecha?: string | null
          fecha_entrega?: string | null
          id?: string
          observaciones?: string | null
          recibido_por?: string | null
          registrado_por?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "envio_apt_fk"
            columns: ["apartamento_id"]
            isOneToOne: false
            referencedRelation: "apartamentos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "envio_apt_fk"
            columns: ["apartamento_id"]
            isOneToOne: false
            referencedRelation: "vista_apartamentos_recepcion"
            referencedColumns: ["apartamento_id"]
          },
          {
            foreignKeyName: "envio_apt_fk"
            columns: ["apartamento_id"]
            isOneToOne: false
            referencedRelation: "vista_dashboard_residente"
            referencedColumns: ["apartamento_id"]
          },
          {
            foreignKeyName: "envio_apt_fk"
            columns: ["apartamento_id"]
            isOneToOne: false
            referencedRelation: "vista_detalle_apt"
            referencedColumns: ["id_apt"]
          },
          {
            foreignKeyName: "envio_apt_fk"
            columns: ["apartamento_id"]
            isOneToOne: false
            referencedRelation: "vista_envios_recepcion"
            referencedColumns: ["apartamento_id"]
          },
          {
            foreignKeyName: "envio_apt_fk"
            columns: ["apartamento_id"]
            isOneToOne: false
            referencedRelation: "vista_mis_balances_indicadores"
            referencedColumns: ["apartamento_id"]
          },
          {
            foreignKeyName: "envio_apt_fk"
            columns: ["apartamento_id"]
            isOneToOne: false
            referencedRelation: "vista_mis_residentes"
            referencedColumns: ["apartamento_id"]
          },
          {
            foreignKeyName: "envio_apt_fk"
            columns: ["apartamento_id"]
            isOneToOne: false
            referencedRelation: "vista_visitas_recepcion"
            referencedColumns: ["apartamento_id"]
          },
          {
            foreignKeyName: "envios_entregado_por_fkey"
            columns: ["entregado_por"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "envios_entregado_por_fkey"
            columns: ["entregado_por"]
            isOneToOne: false
            referencedRelation: "vista_asignacion_suscripciones"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "envios_entregado_por_fkey"
            columns: ["entregado_por"]
            isOneToOne: false
            referencedRelation: "vista_conjuntos_admin"
            referencedColumns: ["admin_id"]
          },
          {
            foreignKeyName: "envios_entregado_por_fkey"
            columns: ["entregado_por"]
            isOneToOne: false
            referencedRelation: "vista_detalle_admin"
            referencedColumns: ["admin_id"]
          },
          {
            foreignKeyName: "envios_entregado_por_fkey"
            columns: ["entregado_por"]
            isOneToOne: false
            referencedRelation: "vista_miembros_admin"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "envios_entregado_por_fkey"
            columns: ["entregado_por"]
            isOneToOne: false
            referencedRelation: "vista_mis_balances_indicadores"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "envios_entregado_por_fkey"
            columns: ["entregado_por"]
            isOneToOne: false
            referencedRelation: "vista_mis_residentes"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "envios_entregado_por_fkey"
            columns: ["entregado_por"]
            isOneToOne: false
            referencedRelation: "vista_perfil"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "envios_entregado_por_fkey"
            columns: ["entregado_por"]
            isOneToOne: false
            referencedRelation: "vista_perfil_administracion"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "envios_entregado_por_fkey"
            columns: ["entregado_por"]
            isOneToOne: false
            referencedRelation: "vista_residentes_por_apartamento"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "envios_registrado_por_fkey"
            columns: ["registrado_por"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "envios_registrado_por_fkey"
            columns: ["registrado_por"]
            isOneToOne: false
            referencedRelation: "vista_asignacion_suscripciones"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "envios_registrado_por_fkey"
            columns: ["registrado_por"]
            isOneToOne: false
            referencedRelation: "vista_conjuntos_admin"
            referencedColumns: ["admin_id"]
          },
          {
            foreignKeyName: "envios_registrado_por_fkey"
            columns: ["registrado_por"]
            isOneToOne: false
            referencedRelation: "vista_detalle_admin"
            referencedColumns: ["admin_id"]
          },
          {
            foreignKeyName: "envios_registrado_por_fkey"
            columns: ["registrado_por"]
            isOneToOne: false
            referencedRelation: "vista_miembros_admin"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "envios_registrado_por_fkey"
            columns: ["registrado_por"]
            isOneToOne: false
            referencedRelation: "vista_mis_balances_indicadores"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "envios_registrado_por_fkey"
            columns: ["registrado_por"]
            isOneToOne: false
            referencedRelation: "vista_mis_residentes"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "envios_registrado_por_fkey"
            columns: ["registrado_por"]
            isOneToOne: false
            referencedRelation: "vista_perfil"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "envios_registrado_por_fkey"
            columns: ["registrado_por"]
            isOneToOne: false
            referencedRelation: "vista_perfil_administracion"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "envios_registrado_por_fkey"
            columns: ["registrado_por"]
            isOneToOne: false
            referencedRelation: "vista_residentes_por_apartamento"
            referencedColumns: ["user_id"]
          },
        ]
      }
      invitaciones: {
        Row: {
          apartamento_id: string | null
          apellidos: string | null
          conjunto_id: string
          creado_en: string | null
          email: string
          expira_en: string
          id: string
          nombres: string | null
          numero_documento: string | null
          rol: string
          telefono: string | null
          tipo_documento: string | null
          token: string
          usado: boolean | null
          usado_en: string | null
        }
        Insert: {
          apartamento_id?: string | null
          apellidos?: string | null
          conjunto_id: string
          creado_en?: string | null
          email: string
          expira_en?: string
          id?: string
          nombres?: string | null
          numero_documento?: string | null
          rol: string
          telefono?: string | null
          tipo_documento?: string | null
          token: string
          usado?: boolean | null
          usado_en?: string | null
        }
        Update: {
          apartamento_id?: string | null
          apellidos?: string | null
          conjunto_id?: string
          creado_en?: string | null
          email?: string
          expira_en?: string
          id?: string
          nombres?: string | null
          numero_documento?: string | null
          rol?: string
          telefono?: string | null
          tipo_documento?: string | null
          token?: string
          usado?: boolean | null
          usado_en?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "invitacion_apartamento_fk"
            columns: ["apartamento_id"]
            isOneToOne: false
            referencedRelation: "apartamentos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invitacion_apartamento_fk"
            columns: ["apartamento_id"]
            isOneToOne: false
            referencedRelation: "vista_apartamentos_recepcion"
            referencedColumns: ["apartamento_id"]
          },
          {
            foreignKeyName: "invitacion_apartamento_fk"
            columns: ["apartamento_id"]
            isOneToOne: false
            referencedRelation: "vista_dashboard_residente"
            referencedColumns: ["apartamento_id"]
          },
          {
            foreignKeyName: "invitacion_apartamento_fk"
            columns: ["apartamento_id"]
            isOneToOne: false
            referencedRelation: "vista_detalle_apt"
            referencedColumns: ["id_apt"]
          },
          {
            foreignKeyName: "invitacion_apartamento_fk"
            columns: ["apartamento_id"]
            isOneToOne: false
            referencedRelation: "vista_envios_recepcion"
            referencedColumns: ["apartamento_id"]
          },
          {
            foreignKeyName: "invitacion_apartamento_fk"
            columns: ["apartamento_id"]
            isOneToOne: false
            referencedRelation: "vista_mis_balances_indicadores"
            referencedColumns: ["apartamento_id"]
          },
          {
            foreignKeyName: "invitacion_apartamento_fk"
            columns: ["apartamento_id"]
            isOneToOne: false
            referencedRelation: "vista_mis_residentes"
            referencedColumns: ["apartamento_id"]
          },
          {
            foreignKeyName: "invitacion_apartamento_fk"
            columns: ["apartamento_id"]
            isOneToOne: false
            referencedRelation: "vista_visitas_recepcion"
            referencedColumns: ["apartamento_id"]
          },
          {
            foreignKeyName: "invitaciones_conjunto_id_fkey"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "conjuntos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invitaciones_conjunto_id_fkey"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_asignacion_suscripciones"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "invitaciones_conjunto_id_fkey"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_configuracion_actual"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "invitaciones_conjunto_id_fkey"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_conjuntos_admin"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "invitaciones_conjunto_id_fkey"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_dashbard_admin"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "invitaciones_conjunto_id_fkey"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_dashboard_residente"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "invitaciones_conjunto_id_fkey"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_editar_conjunto"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invitaciones_conjunto_id_fkey"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_gestion_conjuntos"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "invitaciones_conjunto_id_fkey"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_mis_conjuntos"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "invitaciones_conjunto_id_fkey"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_mis_conjuntos_administracion"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "invitaciones_conjunto_id_fkey"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_mis_conjuntos_con_suscripcion"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "invitaciones_conjunto_id_fkey"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_mis_conjuntos_seleccion"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "invitaciones_conjunto_id_fkey"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_pagos_detalle"
            referencedColumns: ["conjunto_id"]
          },
        ]
      }
      mascotas: {
        Row: {
          especie: string | null
          id: number
          nombre: string
          raza: string | null
          residente_id: string
          tamano: string | null
        }
        Insert: {
          especie?: string | null
          id?: number
          nombre: string
          raza?: string | null
          residente_id: string
          tamano?: string | null
        }
        Update: {
          especie?: string | null
          id?: number
          nombre?: string
          raza?: string | null
          residente_id?: string
          tamano?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "mascota_res_fk"
            columns: ["residente_id"]
            isOneToOne: false
            referencedRelation: "residentes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mascota_res_fk"
            columns: ["residente_id"]
            isOneToOne: false
            referencedRelation: "vista_gestion_solicitudes"
            referencedColumns: ["id_residente"]
          },
          {
            foreignKeyName: "mascota_res_fk"
            columns: ["residente_id"]
            isOneToOne: false
            referencedRelation: "vista_mis_balances_indicadores"
            referencedColumns: ["residente_id"]
          },
          {
            foreignKeyName: "mascota_res_fk"
            columns: ["residente_id"]
            isOneToOne: false
            referencedRelation: "vista_mis_residentes"
            referencedColumns: ["residente_id"]
          },
          {
            foreignKeyName: "mascota_res_fk"
            columns: ["residente_id"]
            isOneToOne: false
            referencedRelation: "vista_residente_completo"
            referencedColumns: ["residente_id"]
          },
          {
            foreignKeyName: "mascota_res_fk"
            columns: ["residente_id"]
            isOneToOne: false
            referencedRelation: "vista_residentes_por_apartamento"
            referencedColumns: ["residente_id"]
          },
          {
            foreignKeyName: "mascota_res_fk"
            columns: ["residente_id"]
            isOneToOne: false
            referencedRelation: "vista_saldos_por_concepto_residente"
            referencedColumns: ["residente_id"]
          },
        ]
      }
      notifications: {
        Row: {
          "big-Image": string | null
          comunicado_id: string | null
          conjunto_id: string | null
          content: string | null
          created_at: string
          enviado_por: string | null
          fecha_envio: string | null
          id: number
          leida: boolean | null
          roles: string[] | null
          tipo_notificacion: string
          title: string | null
          userIds: string[] | null
          visita_id: string | null
        }
        Insert: {
          "big-Image"?: string | null
          comunicado_id?: string | null
          conjunto_id?: string | null
          content?: string | null
          created_at?: string
          enviado_por?: string | null
          fecha_envio?: string | null
          id?: number
          leida?: boolean | null
          roles?: string[] | null
          tipo_notificacion?: string
          title?: string | null
          userIds?: string[] | null
          visita_id?: string | null
        }
        Update: {
          "big-Image"?: string | null
          comunicado_id?: string | null
          conjunto_id?: string | null
          content?: string | null
          created_at?: string
          enviado_por?: string | null
          fecha_envio?: string | null
          id?: number
          leida?: boolean | null
          roles?: string[] | null
          tipo_notificacion?: string
          title?: string | null
          userIds?: string[] | null
          visita_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notifications_comunicado_fk"
            columns: ["comunicado_id"]
            isOneToOne: false
            referencedRelation: "comunicados"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_conjunto_id_fkey"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "conjuntos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_conjunto_id_fkey"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_asignacion_suscripciones"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "notifications_conjunto_id_fkey"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_configuracion_actual"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "notifications_conjunto_id_fkey"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_conjuntos_admin"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "notifications_conjunto_id_fkey"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_dashbard_admin"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "notifications_conjunto_id_fkey"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_dashboard_residente"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "notifications_conjunto_id_fkey"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_editar_conjunto"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_conjunto_id_fkey"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_gestion_conjuntos"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "notifications_conjunto_id_fkey"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_mis_conjuntos"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "notifications_conjunto_id_fkey"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_mis_conjuntos_administracion"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "notifications_conjunto_id_fkey"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_mis_conjuntos_con_suscripcion"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "notifications_conjunto_id_fkey"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_mis_conjuntos_seleccion"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "notifications_conjunto_id_fkey"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_pagos_detalle"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "notifications_enviado_por_fkey"
            columns: ["enviado_por"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_enviado_por_fkey"
            columns: ["enviado_por"]
            isOneToOne: false
            referencedRelation: "vista_asignacion_suscripciones"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "notifications_enviado_por_fkey"
            columns: ["enviado_por"]
            isOneToOne: false
            referencedRelation: "vista_conjuntos_admin"
            referencedColumns: ["admin_id"]
          },
          {
            foreignKeyName: "notifications_enviado_por_fkey"
            columns: ["enviado_por"]
            isOneToOne: false
            referencedRelation: "vista_detalle_admin"
            referencedColumns: ["admin_id"]
          },
          {
            foreignKeyName: "notifications_enviado_por_fkey"
            columns: ["enviado_por"]
            isOneToOne: false
            referencedRelation: "vista_miembros_admin"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "notifications_enviado_por_fkey"
            columns: ["enviado_por"]
            isOneToOne: false
            referencedRelation: "vista_mis_balances_indicadores"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "notifications_enviado_por_fkey"
            columns: ["enviado_por"]
            isOneToOne: false
            referencedRelation: "vista_mis_residentes"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "notifications_enviado_por_fkey"
            columns: ["enviado_por"]
            isOneToOne: false
            referencedRelation: "vista_perfil"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "notifications_enviado_por_fkey"
            columns: ["enviado_por"]
            isOneToOne: false
            referencedRelation: "vista_perfil_administracion"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "notifications_enviado_por_fkey"
            columns: ["enviado_por"]
            isOneToOne: false
            referencedRelation: "vista_residentes_por_apartamento"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "notifications_visita_fk"
            columns: ["visita_id"]
            isOneToOne: false
            referencedRelation: "visitas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_visita_fk"
            columns: ["visita_id"]
            isOneToOne: false
            referencedRelation: "vista_visitas_recepcion"
            referencedColumns: ["id"]
          },
        ]
      }
      pagos: {
        Row: {
          created_at: string | null
          datos_pago: Json | null
          estado: Database["public"]["Enums"]["estado_pago"]
          fecha_pago: string | null
          id: string
          metodo_pago: string
          monto: number
          referencia_externa: string | null
          suscripcion_id: string | null
        }
        Insert: {
          created_at?: string | null
          datos_pago?: Json | null
          estado?: Database["public"]["Enums"]["estado_pago"]
          fecha_pago?: string | null
          id?: string
          metodo_pago: string
          monto: number
          referencia_externa?: string | null
          suscripcion_id?: string | null
        }
        Update: {
          created_at?: string | null
          datos_pago?: Json | null
          estado?: Database["public"]["Enums"]["estado_pago"]
          fecha_pago?: string | null
          id?: string
          metodo_pago?: string
          monto?: number
          referencia_externa?: string | null
          suscripcion_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pagos_suscripcion_id_fkey"
            columns: ["suscripcion_id"]
            isOneToOne: false
            referencedRelation: "suscripciones"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pagos_suscripcion_id_fkey"
            columns: ["suscripcion_id"]
            isOneToOne: false
            referencedRelation: "vista_asignacion_suscripciones"
            referencedColumns: ["suscripcion_id"]
          },
          {
            foreignKeyName: "pagos_suscripcion_id_fkey"
            columns: ["suscripcion_id"]
            isOneToOne: false
            referencedRelation: "vista_detalle_suscripciones"
            referencedColumns: ["suscripcion_id"]
          },
          {
            foreignKeyName: "pagos_suscripcion_id_fkey"
            columns: ["suscripcion_id"]
            isOneToOne: false
            referencedRelation: "vista_pagos_detalle"
            referencedColumns: ["suscripcion_id"]
          },
          {
            foreignKeyName: "pagos_suscripcion_id_fkey"
            columns: ["suscripcion_id"]
            isOneToOne: false
            referencedRelation: "vista_superadmin_nuevas_suscripciones"
            referencedColumns: ["id"]
          },
        ]
      }
      planes: {
        Row: {
          activo: boolean | null
          created_at: string | null
          descripcion: string | null
          id: string
          max_residentes: number
          nombre: string
          precio_anual: number
          precio_mensual: number
          precio_trimestral: number
          subtipo: string
        }
        Insert: {
          activo?: boolean | null
          created_at?: string | null
          descripcion?: string | null
          id?: string
          max_residentes: number
          nombre: string
          precio_anual: number
          precio_mensual: number
          precio_trimestral: number
          subtipo?: string
        }
        Update: {
          activo?: boolean | null
          created_at?: string | null
          descripcion?: string | null
          id?: string
          max_residentes?: number
          nombre?: string
          precio_anual?: number
          precio_mensual?: number
          precio_trimestral?: number
          subtipo?: string
        }
        Relationships: []
      }
      recaudos: {
        Row: {
          apartamento_id: string
          archivo_url: string
          conjunto_id: string
          creado_en: string | null
          fecha: string
          fecha_aplicacion: string
          id: string
          origen: string | null
          periodo: string
          referencia_1: string | null
          referencia_2: string | null
          referencia_3: string | null
          referencia_4: string | null
          referencia_5: string | null
          tipo_recaudo_origen: string | null
          valor_cheque: number | null
          valor_efectivo: number | null
          valor_total: number | null
        }
        Insert: {
          apartamento_id: string
          archivo_url: string
          conjunto_id: string
          creado_en?: string | null
          fecha: string
          fecha_aplicacion: string
          id?: string
          origen?: string | null
          periodo: string
          referencia_1?: string | null
          referencia_2?: string | null
          referencia_3?: string | null
          referencia_4?: string | null
          referencia_5?: string | null
          tipo_recaudo_origen?: string | null
          valor_cheque?: number | null
          valor_efectivo?: number | null
          valor_total?: number | null
        }
        Update: {
          apartamento_id?: string
          archivo_url?: string
          conjunto_id?: string
          creado_en?: string | null
          fecha?: string
          fecha_aplicacion?: string
          id?: string
          origen?: string | null
          periodo?: string
          referencia_1?: string | null
          referencia_2?: string | null
          referencia_3?: string | null
          referencia_4?: string | null
          referencia_5?: string | null
          tipo_recaudo_origen?: string | null
          valor_cheque?: number | null
          valor_efectivo?: number | null
          valor_total?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "recaudos_apartamento_id_fkey"
            columns: ["apartamento_id"]
            isOneToOne: false
            referencedRelation: "apartamentos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recaudos_apartamento_id_fkey"
            columns: ["apartamento_id"]
            isOneToOne: false
            referencedRelation: "vista_apartamentos_recepcion"
            referencedColumns: ["apartamento_id"]
          },
          {
            foreignKeyName: "recaudos_apartamento_id_fkey"
            columns: ["apartamento_id"]
            isOneToOne: false
            referencedRelation: "vista_dashboard_residente"
            referencedColumns: ["apartamento_id"]
          },
          {
            foreignKeyName: "recaudos_apartamento_id_fkey"
            columns: ["apartamento_id"]
            isOneToOne: false
            referencedRelation: "vista_detalle_apt"
            referencedColumns: ["id_apt"]
          },
          {
            foreignKeyName: "recaudos_apartamento_id_fkey"
            columns: ["apartamento_id"]
            isOneToOne: false
            referencedRelation: "vista_envios_recepcion"
            referencedColumns: ["apartamento_id"]
          },
          {
            foreignKeyName: "recaudos_apartamento_id_fkey"
            columns: ["apartamento_id"]
            isOneToOne: false
            referencedRelation: "vista_mis_balances_indicadores"
            referencedColumns: ["apartamento_id"]
          },
          {
            foreignKeyName: "recaudos_apartamento_id_fkey"
            columns: ["apartamento_id"]
            isOneToOne: false
            referencedRelation: "vista_mis_residentes"
            referencedColumns: ["apartamento_id"]
          },
          {
            foreignKeyName: "recaudos_apartamento_id_fkey"
            columns: ["apartamento_id"]
            isOneToOne: false
            referencedRelation: "vista_visitas_recepcion"
            referencedColumns: ["apartamento_id"]
          },
          {
            foreignKeyName: "recaudos_conjunto_id_fkey"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "conjuntos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recaudos_conjunto_id_fkey"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_asignacion_suscripciones"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "recaudos_conjunto_id_fkey"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_configuracion_actual"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "recaudos_conjunto_id_fkey"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_conjuntos_admin"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "recaudos_conjunto_id_fkey"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_dashbard_admin"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "recaudos_conjunto_id_fkey"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_dashboard_residente"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "recaudos_conjunto_id_fkey"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_editar_conjunto"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recaudos_conjunto_id_fkey"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_gestion_conjuntos"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "recaudos_conjunto_id_fkey"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_mis_conjuntos"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "recaudos_conjunto_id_fkey"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_mis_conjuntos_administracion"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "recaudos_conjunto_id_fkey"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_mis_conjuntos_con_suscripcion"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "recaudos_conjunto_id_fkey"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_mis_conjuntos_seleccion"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "recaudos_conjunto_id_fkey"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_pagos_detalle"
            referencedColumns: ["conjunto_id"]
          },
        ]
      }
      reportes_legacy: {
        Row: {
          adjunto: string | null
          apartamento_id: string | null
          conjunto_id: string | null
          descripcion: string
          fecha: string
          id: string
          tipo_novedad: string
          titulo: string
          user_id: string | null
        }
        Insert: {
          adjunto?: string | null
          apartamento_id?: string | null
          conjunto_id?: string | null
          descripcion: string
          fecha?: string
          id?: string
          tipo_novedad: string
          titulo: string
          user_id?: string | null
        }
        Update: {
          adjunto?: string | null
          apartamento_id?: string | null
          conjunto_id?: string | null
          descripcion?: string
          fecha?: string
          id?: string
          tipo_novedad?: string
          titulo?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reportes_apartamento_fk"
            columns: ["apartamento_id"]
            isOneToOne: false
            referencedRelation: "apartamentos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reportes_apartamento_fk"
            columns: ["apartamento_id"]
            isOneToOne: false
            referencedRelation: "vista_apartamentos_recepcion"
            referencedColumns: ["apartamento_id"]
          },
          {
            foreignKeyName: "reportes_apartamento_fk"
            columns: ["apartamento_id"]
            isOneToOne: false
            referencedRelation: "vista_dashboard_residente"
            referencedColumns: ["apartamento_id"]
          },
          {
            foreignKeyName: "reportes_apartamento_fk"
            columns: ["apartamento_id"]
            isOneToOne: false
            referencedRelation: "vista_detalle_apt"
            referencedColumns: ["id_apt"]
          },
          {
            foreignKeyName: "reportes_apartamento_fk"
            columns: ["apartamento_id"]
            isOneToOne: false
            referencedRelation: "vista_envios_recepcion"
            referencedColumns: ["apartamento_id"]
          },
          {
            foreignKeyName: "reportes_apartamento_fk"
            columns: ["apartamento_id"]
            isOneToOne: false
            referencedRelation: "vista_mis_balances_indicadores"
            referencedColumns: ["apartamento_id"]
          },
          {
            foreignKeyName: "reportes_apartamento_fk"
            columns: ["apartamento_id"]
            isOneToOne: false
            referencedRelation: "vista_mis_residentes"
            referencedColumns: ["apartamento_id"]
          },
          {
            foreignKeyName: "reportes_apartamento_fk"
            columns: ["apartamento_id"]
            isOneToOne: false
            referencedRelation: "vista_visitas_recepcion"
            referencedColumns: ["apartamento_id"]
          },
          {
            foreignKeyName: "reportes_conjunto_fk"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "conjuntos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reportes_conjunto_fk"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_asignacion_suscripciones"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "reportes_conjunto_fk"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_configuracion_actual"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "reportes_conjunto_fk"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_conjuntos_admin"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "reportes_conjunto_fk"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_dashbard_admin"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "reportes_conjunto_fk"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_dashboard_residente"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "reportes_conjunto_fk"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_editar_conjunto"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reportes_conjunto_fk"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_gestion_conjuntos"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "reportes_conjunto_fk"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_mis_conjuntos"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "reportes_conjunto_fk"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_mis_conjuntos_administracion"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "reportes_conjunto_fk"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_mis_conjuntos_con_suscripcion"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "reportes_conjunto_fk"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_mis_conjuntos_seleccion"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "reportes_conjunto_fk"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_pagos_detalle"
            referencedColumns: ["conjunto_id"]
          },
        ]
      }
      residentes: {
        Row: {
          activo: boolean
          ano_ingreso: number | null
          apartamento_id: string | null
          conjunto_id: string
          direccion_unidad: string | null
          estrato: number | null
          id: string
          user_id: string
        }
        Insert: {
          activo?: boolean
          ano_ingreso?: number | null
          apartamento_id?: string | null
          conjunto_id: string
          direccion_unidad?: string | null
          estrato?: number | null
          id?: string
          user_id: string
        }
        Update: {
          activo?: boolean
          ano_ingreso?: number | null
          apartamento_id?: string | null
          conjunto_id?: string
          direccion_unidad?: string | null
          estrato?: number | null
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "residente_apto_fk"
            columns: ["apartamento_id"]
            isOneToOne: false
            referencedRelation: "apartamentos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "residente_apto_fk"
            columns: ["apartamento_id"]
            isOneToOne: false
            referencedRelation: "vista_apartamentos_recepcion"
            referencedColumns: ["apartamento_id"]
          },
          {
            foreignKeyName: "residente_apto_fk"
            columns: ["apartamento_id"]
            isOneToOne: false
            referencedRelation: "vista_dashboard_residente"
            referencedColumns: ["apartamento_id"]
          },
          {
            foreignKeyName: "residente_apto_fk"
            columns: ["apartamento_id"]
            isOneToOne: false
            referencedRelation: "vista_detalle_apt"
            referencedColumns: ["id_apt"]
          },
          {
            foreignKeyName: "residente_apto_fk"
            columns: ["apartamento_id"]
            isOneToOne: false
            referencedRelation: "vista_envios_recepcion"
            referencedColumns: ["apartamento_id"]
          },
          {
            foreignKeyName: "residente_apto_fk"
            columns: ["apartamento_id"]
            isOneToOne: false
            referencedRelation: "vista_mis_balances_indicadores"
            referencedColumns: ["apartamento_id"]
          },
          {
            foreignKeyName: "residente_apto_fk"
            columns: ["apartamento_id"]
            isOneToOne: false
            referencedRelation: "vista_mis_residentes"
            referencedColumns: ["apartamento_id"]
          },
          {
            foreignKeyName: "residente_apto_fk"
            columns: ["apartamento_id"]
            isOneToOne: false
            referencedRelation: "vista_visitas_recepcion"
            referencedColumns: ["apartamento_id"]
          },
          {
            foreignKeyName: "residente_conjunto_fk"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "conjuntos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "residente_conjunto_fk"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_asignacion_suscripciones"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "residente_conjunto_fk"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_configuracion_actual"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "residente_conjunto_fk"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_conjuntos_admin"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "residente_conjunto_fk"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_dashbard_admin"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "residente_conjunto_fk"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_dashboard_residente"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "residente_conjunto_fk"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_editar_conjunto"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "residente_conjunto_fk"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_gestion_conjuntos"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "residente_conjunto_fk"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_mis_conjuntos"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "residente_conjunto_fk"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_mis_conjuntos_administracion"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "residente_conjunto_fk"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_mis_conjuntos_con_suscripcion"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "residente_conjunto_fk"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_mis_conjuntos_seleccion"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "residente_conjunto_fk"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_pagos_detalle"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "residente_user_fk"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "residente_user_fk"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "vista_asignacion_suscripciones"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "residente_user_fk"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "vista_conjuntos_admin"
            referencedColumns: ["admin_id"]
          },
          {
            foreignKeyName: "residente_user_fk"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "vista_detalle_admin"
            referencedColumns: ["admin_id"]
          },
          {
            foreignKeyName: "residente_user_fk"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "vista_miembros_admin"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "residente_user_fk"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "vista_mis_balances_indicadores"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "residente_user_fk"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "vista_mis_residentes"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "residente_user_fk"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "vista_perfil"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "residente_user_fk"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "vista_perfil_administracion"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "residente_user_fk"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "vista_residentes_por_apartamento"
            referencedColumns: ["user_id"]
          },
        ]
      }
      solicitudes: {
        Row: {
          admin_comentario: string | null
          asignado_admin_conjunto_id: string | null
          conjunto_id: string
          costo: number | null
          created_at: string
          descripcion: string
          fecha_atencion_solicitud: string | null
          fecha_atencion_viable: boolean | null
          fecha_preferida: string | null
          fecha_solicitud: string
          hora_atencion: string | null
          id: string
          residente_id: string
          solicitud_estado: Database["public"]["Enums"]["solicitud_estado_enum"]
          solicitud_prioridad:
            | Database["public"]["Enums"]["solicitud_prioridad_enum"]
            | null
          solicitud_tipo: Database["public"]["Enums"]["solicitud_tipo_enum"]
          titulo_solicitud: string
          ubicacion: string | null
          updated_at: string
        }
        Insert: {
          admin_comentario?: string | null
          asignado_admin_conjunto_id?: string | null
          conjunto_id: string
          costo?: number | null
          created_at?: string
          descripcion: string
          fecha_atencion_solicitud?: string | null
          fecha_atencion_viable?: boolean | null
          fecha_preferida?: string | null
          fecha_solicitud?: string
          hora_atencion?: string | null
          id?: string
          residente_id: string
          solicitud_estado: Database["public"]["Enums"]["solicitud_estado_enum"]
          solicitud_prioridad?:
            | Database["public"]["Enums"]["solicitud_prioridad_enum"]
            | null
          solicitud_tipo: Database["public"]["Enums"]["solicitud_tipo_enum"]
          titulo_solicitud: string
          ubicacion?: string | null
          updated_at?: string
        }
        Update: {
          admin_comentario?: string | null
          asignado_admin_conjunto_id?: string | null
          conjunto_id?: string
          costo?: number | null
          created_at?: string
          descripcion?: string
          fecha_atencion_solicitud?: string | null
          fecha_atencion_viable?: boolean | null
          fecha_preferida?: string | null
          fecha_solicitud?: string
          hora_atencion?: string | null
          id?: string
          residente_id?: string
          solicitud_estado?: Database["public"]["Enums"]["solicitud_estado_enum"]
          solicitud_prioridad?:
            | Database["public"]["Enums"]["solicitud_prioridad_enum"]
            | null
          solicitud_tipo?: Database["public"]["Enums"]["solicitud_tipo_enum"]
          titulo_solicitud?: string
          ubicacion?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "solicitudes_asignado_admin_fk"
            columns: ["asignado_admin_conjunto_id"]
            isOneToOne: false
            referencedRelation: "admins_conjuntos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "solicitudes_asignado_admin_fk"
            columns: ["asignado_admin_conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_admins_dropdown"
            referencedColumns: ["admin_conjunto_id"]
          },
          {
            foreignKeyName: "solicitudes_asignado_admin_fk"
            columns: ["asignado_admin_conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_gestion_solicitudes_detalle"
            referencedColumns: ["admin_conjunto_id"]
          },
          {
            foreignKeyName: "solicitudes_conjunto_fk"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "conjuntos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "solicitudes_conjunto_fk"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_asignacion_suscripciones"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "solicitudes_conjunto_fk"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_configuracion_actual"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "solicitudes_conjunto_fk"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_conjuntos_admin"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "solicitudes_conjunto_fk"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_dashbard_admin"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "solicitudes_conjunto_fk"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_dashboard_residente"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "solicitudes_conjunto_fk"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_editar_conjunto"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "solicitudes_conjunto_fk"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_gestion_conjuntos"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "solicitudes_conjunto_fk"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_mis_conjuntos"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "solicitudes_conjunto_fk"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_mis_conjuntos_administracion"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "solicitudes_conjunto_fk"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_mis_conjuntos_con_suscripcion"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "solicitudes_conjunto_fk"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_mis_conjuntos_seleccion"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "solicitudes_conjunto_fk"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_pagos_detalle"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "solicitudes_residente_fk"
            columns: ["residente_id"]
            isOneToOne: false
            referencedRelation: "residentes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "solicitudes_residente_fk"
            columns: ["residente_id"]
            isOneToOne: false
            referencedRelation: "vista_gestion_solicitudes"
            referencedColumns: ["id_residente"]
          },
          {
            foreignKeyName: "solicitudes_residente_fk"
            columns: ["residente_id"]
            isOneToOne: false
            referencedRelation: "vista_mis_balances_indicadores"
            referencedColumns: ["residente_id"]
          },
          {
            foreignKeyName: "solicitudes_residente_fk"
            columns: ["residente_id"]
            isOneToOne: false
            referencedRelation: "vista_mis_residentes"
            referencedColumns: ["residente_id"]
          },
          {
            foreignKeyName: "solicitudes_residente_fk"
            columns: ["residente_id"]
            isOneToOne: false
            referencedRelation: "vista_residente_completo"
            referencedColumns: ["residente_id"]
          },
          {
            foreignKeyName: "solicitudes_residente_fk"
            columns: ["residente_id"]
            isOneToOne: false
            referencedRelation: "vista_residentes_por_apartamento"
            referencedColumns: ["residente_id"]
          },
          {
            foreignKeyName: "solicitudes_residente_fk"
            columns: ["residente_id"]
            isOneToOne: false
            referencedRelation: "vista_saldos_por_concepto_residente"
            referencedColumns: ["residente_id"]
          },
        ]
      }
      suscripciones: {
        Row: {
          admin_user_id: string
          conjunto_id: string
          created_at: string | null
          estado: Database["public"]["Enums"]["estado_suscripcion"]
          fecha_fin: string
          fecha_inicio: string
          id: string
          metodo_pago: string | null
          plan_id: string
          precio_pagado: number
          referencia_pago: string | null
          tipo_periodo: string
          updated_at: string | null
        }
        Insert: {
          admin_user_id: string
          conjunto_id: string
          created_at?: string | null
          estado?: Database["public"]["Enums"]["estado_suscripcion"]
          fecha_fin: string
          fecha_inicio: string
          id?: string
          metodo_pago?: string | null
          plan_id: string
          precio_pagado: number
          referencia_pago?: string | null
          tipo_periodo: string
          updated_at?: string | null
        }
        Update: {
          admin_user_id?: string
          conjunto_id?: string
          created_at?: string | null
          estado?: Database["public"]["Enums"]["estado_suscripcion"]
          fecha_fin?: string
          fecha_inicio?: string
          id?: string
          metodo_pago?: string | null
          plan_id?: string
          precio_pagado?: number
          referencia_pago?: string | null
          tipo_periodo?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "suscripciones_admin_fk"
            columns: ["admin_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "suscripciones_admin_fk"
            columns: ["admin_user_id"]
            isOneToOne: false
            referencedRelation: "vista_asignacion_suscripciones"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "suscripciones_admin_fk"
            columns: ["admin_user_id"]
            isOneToOne: false
            referencedRelation: "vista_conjuntos_admin"
            referencedColumns: ["admin_id"]
          },
          {
            foreignKeyName: "suscripciones_admin_fk"
            columns: ["admin_user_id"]
            isOneToOne: false
            referencedRelation: "vista_detalle_admin"
            referencedColumns: ["admin_id"]
          },
          {
            foreignKeyName: "suscripciones_admin_fk"
            columns: ["admin_user_id"]
            isOneToOne: false
            referencedRelation: "vista_miembros_admin"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "suscripciones_admin_fk"
            columns: ["admin_user_id"]
            isOneToOne: false
            referencedRelation: "vista_mis_balances_indicadores"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "suscripciones_admin_fk"
            columns: ["admin_user_id"]
            isOneToOne: false
            referencedRelation: "vista_mis_residentes"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "suscripciones_admin_fk"
            columns: ["admin_user_id"]
            isOneToOne: false
            referencedRelation: "vista_perfil"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "suscripciones_admin_fk"
            columns: ["admin_user_id"]
            isOneToOne: false
            referencedRelation: "vista_perfil_administracion"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "suscripciones_admin_fk"
            columns: ["admin_user_id"]
            isOneToOne: false
            referencedRelation: "vista_residentes_por_apartamento"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "suscripciones_conjunto_id_fkey"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "conjuntos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "suscripciones_conjunto_id_fkey"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_asignacion_suscripciones"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "suscripciones_conjunto_id_fkey"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_configuracion_actual"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "suscripciones_conjunto_id_fkey"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_conjuntos_admin"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "suscripciones_conjunto_id_fkey"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_dashbard_admin"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "suscripciones_conjunto_id_fkey"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_dashboard_residente"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "suscripciones_conjunto_id_fkey"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_editar_conjunto"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "suscripciones_conjunto_id_fkey"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_gestion_conjuntos"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "suscripciones_conjunto_id_fkey"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_mis_conjuntos"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "suscripciones_conjunto_id_fkey"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_mis_conjuntos_administracion"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "suscripciones_conjunto_id_fkey"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_mis_conjuntos_con_suscripcion"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "suscripciones_conjunto_id_fkey"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_mis_conjuntos_seleccion"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "suscripciones_conjunto_id_fkey"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_pagos_detalle"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "suscripciones_plan_fk"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "planes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "suscripciones_plan_fk"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "vista_historial_pagos_suscripcion"
            referencedColumns: ["plan_id"]
          },
          {
            foreignKeyName: "suscripciones_plan_fk"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "vista_pagos_detalle"
            referencedColumns: ["plan_id"]
          },
        ]
      }
      torre_pisos: {
        Row: {
          aptos_en_piso: number
          id: string
          piso: number
          torre_id: string
        }
        Insert: {
          aptos_en_piso: number
          id?: string
          piso: number
          torre_id: string
        }
        Update: {
          aptos_en_piso?: number
          id?: string
          piso?: number
          torre_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "torre_pisos_torre_id_fkey"
            columns: ["torre_id"]
            isOneToOne: false
            referencedRelation: "torres"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "torre_pisos_torre_id_fkey"
            columns: ["torre_id"]
            isOneToOne: false
            referencedRelation: "vista_apartamentos_recepcion"
            referencedColumns: ["torre_id"]
          },
          {
            foreignKeyName: "torre_pisos_torre_id_fkey"
            columns: ["torre_id"]
            isOneToOne: false
            referencedRelation: "vista_envios_recepcion"
            referencedColumns: ["torre_id"]
          },
          {
            foreignKeyName: "torre_pisos_torre_id_fkey"
            columns: ["torre_id"]
            isOneToOne: false
            referencedRelation: "vista_gestion_torres"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "torre_pisos_torre_id_fkey"
            columns: ["torre_id"]
            isOneToOne: false
            referencedRelation: "vista_visitas_recepcion"
            referencedColumns: ["torre_id"]
          },
        ]
      }
      torres: {
        Row: {
          aptos_por_piso: number | null
          conjunto_id: string
          created_at: string | null
          id: string
          nombre: string
          num_pisos: number | null
          prefijo: string | null
          total_apartamentos: number | null
          updated_at: string | null
        }
        Insert: {
          aptos_por_piso?: number | null
          conjunto_id: string
          created_at?: string | null
          id?: string
          nombre: string
          num_pisos?: number | null
          prefijo?: string | null
          total_apartamentos?: number | null
          updated_at?: string | null
        }
        Update: {
          aptos_por_piso?: number | null
          conjunto_id?: string
          created_at?: string | null
          id?: string
          nombre?: string
          num_pisos?: number | null
          prefijo?: string | null
          total_apartamentos?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "torres_conjunto_fk"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "conjuntos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "torres_conjunto_fk"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_asignacion_suscripciones"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "torres_conjunto_fk"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_configuracion_actual"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "torres_conjunto_fk"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_conjuntos_admin"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "torres_conjunto_fk"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_dashbard_admin"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "torres_conjunto_fk"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_dashboard_residente"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "torres_conjunto_fk"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_editar_conjunto"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "torres_conjunto_fk"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_gestion_conjuntos"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "torres_conjunto_fk"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_mis_conjuntos"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "torres_conjunto_fk"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_mis_conjuntos_administracion"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "torres_conjunto_fk"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_mis_conjuntos_con_suscripcion"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "torres_conjunto_fk"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_mis_conjuntos_seleccion"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "torres_conjunto_fk"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_pagos_detalle"
            referencedColumns: ["conjunto_id"]
          },
        ]
      }
      transacciones_conjunto: {
        Row: {
          conjunto_id: string
          descripcion: string | null
          estado: string | null
          fecha: string | null
          id: string
          monto: number
          tipo_transaccion: string
        }
        Insert: {
          conjunto_id: string
          descripcion?: string | null
          estado?: string | null
          fecha?: string | null
          id?: string
          monto: number
          tipo_transaccion: string
        }
        Update: {
          conjunto_id?: string
          descripcion?: string | null
          estado?: string | null
          fecha?: string | null
          id?: string
          monto?: number
          tipo_transaccion?: string
        }
        Relationships: [
          {
            foreignKeyName: "tx_conjunto_fk"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "conjuntos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tx_conjunto_fk"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_asignacion_suscripciones"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "tx_conjunto_fk"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_configuracion_actual"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "tx_conjunto_fk"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_conjuntos_admin"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "tx_conjunto_fk"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_dashbard_admin"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "tx_conjunto_fk"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_dashboard_residente"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "tx_conjunto_fk"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_editar_conjunto"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tx_conjunto_fk"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_gestion_conjuntos"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "tx_conjunto_fk"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_mis_conjuntos"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "tx_conjunto_fk"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_mis_conjuntos_administracion"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "tx_conjunto_fk"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_mis_conjuntos_con_suscripcion"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "tx_conjunto_fk"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_mis_conjuntos_seleccion"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "tx_conjunto_fk"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_pagos_detalle"
            referencedColumns: ["conjunto_id"]
          },
        ]
      }
      transacciones_superadmin: {
        Row: {
          admin_user_id: string
          descripcion: string | null
          fecha: string
          id: string
          monto: number
        }
        Insert: {
          admin_user_id: string
          descripcion?: string | null
          fecha?: string
          id?: string
          monto: number
        }
        Update: {
          admin_user_id?: string
          descripcion?: string | null
          fecha?: string
          id?: string
          monto?: number
        }
        Relationships: [
          {
            foreignKeyName: "tx_super_admin_user_fk"
            columns: ["admin_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tx_super_admin_user_fk"
            columns: ["admin_user_id"]
            isOneToOne: false
            referencedRelation: "vista_asignacion_suscripciones"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "tx_super_admin_user_fk"
            columns: ["admin_user_id"]
            isOneToOne: false
            referencedRelation: "vista_conjuntos_admin"
            referencedColumns: ["admin_id"]
          },
          {
            foreignKeyName: "tx_super_admin_user_fk"
            columns: ["admin_user_id"]
            isOneToOne: false
            referencedRelation: "vista_detalle_admin"
            referencedColumns: ["admin_id"]
          },
          {
            foreignKeyName: "tx_super_admin_user_fk"
            columns: ["admin_user_id"]
            isOneToOne: false
            referencedRelation: "vista_miembros_admin"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "tx_super_admin_user_fk"
            columns: ["admin_user_id"]
            isOneToOne: false
            referencedRelation: "vista_mis_balances_indicadores"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "tx_super_admin_user_fk"
            columns: ["admin_user_id"]
            isOneToOne: false
            referencedRelation: "vista_mis_residentes"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "tx_super_admin_user_fk"
            columns: ["admin_user_id"]
            isOneToOne: false
            referencedRelation: "vista_perfil"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "tx_super_admin_user_fk"
            columns: ["admin_user_id"]
            isOneToOne: false
            referencedRelation: "vista_perfil_administracion"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "tx_super_admin_user_fk"
            columns: ["admin_user_id"]
            isOneToOne: false
            referencedRelation: "vista_residentes_por_apartamento"
            referencedColumns: ["user_id"]
          },
        ]
      }
      ubicaciones: {
        Row: {
          codigo_departamento: string
          codigo_municipio: string
          latitud: string | null
          longitud: string | null
          nombre_departamento: string
          nombre_municipio: string
          tipo: string | null
        }
        Insert: {
          codigo_departamento: string
          codigo_municipio: string
          latitud?: string | null
          longitud?: string | null
          nombre_departamento: string
          nombre_municipio: string
          tipo?: string | null
        }
        Update: {
          codigo_departamento?: string
          codigo_municipio?: string
          latitud?: string | null
          longitud?: string | null
          nombre_departamento?: string
          nombre_municipio?: string
          tipo?: string | null
        }
        Relationships: []
      }
      users: {
        Row: {
          apellidos: string | null
          created_at: string | null
          cuenta_bloqueada: boolean | null
          direccion: string | null
          documento: string
          email: string | null
          estado: boolean | null
          fecha_bloqueo: string | null
          foto_url: string | null
          id: string
          intentos_login: number | null
          nombres: string | null
          phone_number: string | null
          rol: string | null
          tipo_documento: string
          token_verificacion: string | null
          ultimo_login: string | null
          updated_at: string | null
          verificado: boolean | null
        }
        Insert: {
          apellidos?: string | null
          created_at?: string | null
          cuenta_bloqueada?: boolean | null
          direccion?: string | null
          documento: string
          email?: string | null
          estado?: boolean | null
          fecha_bloqueo?: string | null
          foto_url?: string | null
          id: string
          intentos_login?: number | null
          nombres?: string | null
          phone_number?: string | null
          rol?: string | null
          tipo_documento: string
          token_verificacion?: string | null
          ultimo_login?: string | null
          updated_at?: string | null
          verificado?: boolean | null
        }
        Update: {
          apellidos?: string | null
          created_at?: string | null
          cuenta_bloqueada?: boolean | null
          direccion?: string | null
          documento?: string
          email?: string | null
          estado?: boolean | null
          fecha_bloqueo?: string | null
          foto_url?: string | null
          id?: string
          intentos_login?: number | null
          nombres?: string | null
          phone_number?: string | null
          rol?: string | null
          tipo_documento?: string
          token_verificacion?: string | null
          ultimo_login?: string | null
          updated_at?: string | null
          verificado?: boolean | null
        }
        Relationships: []
      }
      vehiculos: {
        Row: {
          color: string | null
          id: number
          marca: string
          modelo: string | null
          placa: string | null
          residente_id: string
          tipo_vehiculo: string | null
        }
        Insert: {
          color?: string | null
          id?: number
          marca: string
          modelo?: string | null
          placa?: string | null
          residente_id: string
          tipo_vehiculo?: string | null
        }
        Update: {
          color?: string | null
          id?: number
          marca?: string
          modelo?: string | null
          placa?: string | null
          residente_id?: string
          tipo_vehiculo?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vehiculo_res_fk"
            columns: ["residente_id"]
            isOneToOne: false
            referencedRelation: "residentes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vehiculo_res_fk"
            columns: ["residente_id"]
            isOneToOne: false
            referencedRelation: "vista_gestion_solicitudes"
            referencedColumns: ["id_residente"]
          },
          {
            foreignKeyName: "vehiculo_res_fk"
            columns: ["residente_id"]
            isOneToOne: false
            referencedRelation: "vista_mis_balances_indicadores"
            referencedColumns: ["residente_id"]
          },
          {
            foreignKeyName: "vehiculo_res_fk"
            columns: ["residente_id"]
            isOneToOne: false
            referencedRelation: "vista_mis_residentes"
            referencedColumns: ["residente_id"]
          },
          {
            foreignKeyName: "vehiculo_res_fk"
            columns: ["residente_id"]
            isOneToOne: false
            referencedRelation: "vista_residente_completo"
            referencedColumns: ["residente_id"]
          },
          {
            foreignKeyName: "vehiculo_res_fk"
            columns: ["residente_id"]
            isOneToOne: false
            referencedRelation: "vista_residentes_por_apartamento"
            referencedColumns: ["residente_id"]
          },
          {
            foreignKeyName: "vehiculo_res_fk"
            columns: ["residente_id"]
            isOneToOne: false
            referencedRelation: "vista_saldos_por_concepto_residente"
            referencedColumns: ["residente_id"]
          },
        ]
      }
      visitas: {
        Row: {
          apartamento_id: string
          autorizado_por: string | null
          estado_autorizacion:
            | Database["public"]["Enums"]["estado_visita_enum"]
            | null
          fecha: string | null
          fecha_autorizacion: string | null
          id: string
          motivo: string | null
          nombres: string
          observaciones: string | null
          registrado_por: string | null
          telefono: string | null
        }
        Insert: {
          apartamento_id: string
          autorizado_por?: string | null
          estado_autorizacion?:
            | Database["public"]["Enums"]["estado_visita_enum"]
            | null
          fecha?: string | null
          fecha_autorizacion?: string | null
          id?: string
          motivo?: string | null
          nombres: string
          observaciones?: string | null
          registrado_por?: string | null
          telefono?: string | null
        }
        Update: {
          apartamento_id?: string
          autorizado_por?: string | null
          estado_autorizacion?:
            | Database["public"]["Enums"]["estado_visita_enum"]
            | null
          fecha?: string | null
          fecha_autorizacion?: string | null
          id?: string
          motivo?: string | null
          nombres?: string
          observaciones?: string | null
          registrado_por?: string | null
          telefono?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "visita_apto_fk"
            columns: ["apartamento_id"]
            isOneToOne: false
            referencedRelation: "apartamentos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "visita_apto_fk"
            columns: ["apartamento_id"]
            isOneToOne: false
            referencedRelation: "vista_apartamentos_recepcion"
            referencedColumns: ["apartamento_id"]
          },
          {
            foreignKeyName: "visita_apto_fk"
            columns: ["apartamento_id"]
            isOneToOne: false
            referencedRelation: "vista_dashboard_residente"
            referencedColumns: ["apartamento_id"]
          },
          {
            foreignKeyName: "visita_apto_fk"
            columns: ["apartamento_id"]
            isOneToOne: false
            referencedRelation: "vista_detalle_apt"
            referencedColumns: ["id_apt"]
          },
          {
            foreignKeyName: "visita_apto_fk"
            columns: ["apartamento_id"]
            isOneToOne: false
            referencedRelation: "vista_envios_recepcion"
            referencedColumns: ["apartamento_id"]
          },
          {
            foreignKeyName: "visita_apto_fk"
            columns: ["apartamento_id"]
            isOneToOne: false
            referencedRelation: "vista_mis_balances_indicadores"
            referencedColumns: ["apartamento_id"]
          },
          {
            foreignKeyName: "visita_apto_fk"
            columns: ["apartamento_id"]
            isOneToOne: false
            referencedRelation: "vista_mis_residentes"
            referencedColumns: ["apartamento_id"]
          },
          {
            foreignKeyName: "visita_apto_fk"
            columns: ["apartamento_id"]
            isOneToOne: false
            referencedRelation: "vista_visitas_recepcion"
            referencedColumns: ["apartamento_id"]
          },
          {
            foreignKeyName: "visitas_registrado_por_fkey"
            columns: ["registrado_por"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "visitas_registrado_por_fkey"
            columns: ["registrado_por"]
            isOneToOne: false
            referencedRelation: "vista_asignacion_suscripciones"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "visitas_registrado_por_fkey"
            columns: ["registrado_por"]
            isOneToOne: false
            referencedRelation: "vista_conjuntos_admin"
            referencedColumns: ["admin_id"]
          },
          {
            foreignKeyName: "visitas_registrado_por_fkey"
            columns: ["registrado_por"]
            isOneToOne: false
            referencedRelation: "vista_detalle_admin"
            referencedColumns: ["admin_id"]
          },
          {
            foreignKeyName: "visitas_registrado_por_fkey"
            columns: ["registrado_por"]
            isOneToOne: false
            referencedRelation: "vista_miembros_admin"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "visitas_registrado_por_fkey"
            columns: ["registrado_por"]
            isOneToOne: false
            referencedRelation: "vista_mis_balances_indicadores"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "visitas_registrado_por_fkey"
            columns: ["registrado_por"]
            isOneToOne: false
            referencedRelation: "vista_mis_residentes"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "visitas_registrado_por_fkey"
            columns: ["registrado_por"]
            isOneToOne: false
            referencedRelation: "vista_perfil"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "visitas_registrado_por_fkey"
            columns: ["registrado_por"]
            isOneToOne: false
            referencedRelation: "vista_perfil_administracion"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "visitas_registrado_por_fkey"
            columns: ["registrado_por"]
            isOneToOne: false
            referencedRelation: "vista_residentes_por_apartamento"
            referencedColumns: ["user_id"]
          },
        ]
      }
    }
    Views: {
      vista_admins_dropdown: {
        Row: {
          activo: boolean | null
          admin_conjunto_id: string | null
          apellidos: string | null
          conjunto_id: string | null
          email: string | null
          es_propietario: boolean | null
          nombre_completo: string | null
          nombres: string | null
          user_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_admins_conjuntos_conjunto"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "conjuntos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_admins_conjuntos_conjunto"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_asignacion_suscripciones"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "fk_admins_conjuntos_conjunto"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_configuracion_actual"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "fk_admins_conjuntos_conjunto"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_conjuntos_admin"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "fk_admins_conjuntos_conjunto"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_dashbard_admin"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "fk_admins_conjuntos_conjunto"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_dashboard_residente"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "fk_admins_conjuntos_conjunto"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_editar_conjunto"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_admins_conjuntos_conjunto"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_gestion_conjuntos"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "fk_admins_conjuntos_conjunto"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_mis_conjuntos"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "fk_admins_conjuntos_conjunto"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_mis_conjuntos_administracion"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "fk_admins_conjuntos_conjunto"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_mis_conjuntos_con_suscripcion"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "fk_admins_conjuntos_conjunto"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_mis_conjuntos_seleccion"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "fk_admins_conjuntos_conjunto"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_pagos_detalle"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "fk_admins_conjuntos_user"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_admins_conjuntos_user"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "vista_asignacion_suscripciones"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "fk_admins_conjuntos_user"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "vista_conjuntos_admin"
            referencedColumns: ["admin_id"]
          },
          {
            foreignKeyName: "fk_admins_conjuntos_user"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "vista_detalle_admin"
            referencedColumns: ["admin_id"]
          },
          {
            foreignKeyName: "fk_admins_conjuntos_user"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "vista_miembros_admin"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "fk_admins_conjuntos_user"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "vista_mis_balances_indicadores"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "fk_admins_conjuntos_user"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "vista_mis_residentes"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "fk_admins_conjuntos_user"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "vista_perfil"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "fk_admins_conjuntos_user"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "vista_perfil_administracion"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "fk_admins_conjuntos_user"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "vista_residentes_por_apartamento"
            referencedColumns: ["user_id"]
          },
        ]
      }
      vista_apartamentos_recepcion: {
        Row: {
          apartamento_id: string | null
          conjunto_id: string | null
          label_apartamento: string | null
          numero_apartamento: string | null
          numero_apartamento_num: number | null
          piso: number | null
          torre_id: string | null
          torre_nombre: string | null
        }
        Relationships: [
          {
            foreignKeyName: "apt_conjunto_fk"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "conjuntos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "apt_conjunto_fk"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_asignacion_suscripciones"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "apt_conjunto_fk"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_configuracion_actual"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "apt_conjunto_fk"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_conjuntos_admin"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "apt_conjunto_fk"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_dashbard_admin"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "apt_conjunto_fk"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_dashboard_residente"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "apt_conjunto_fk"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_editar_conjunto"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "apt_conjunto_fk"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_gestion_conjuntos"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "apt_conjunto_fk"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_mis_conjuntos"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "apt_conjunto_fk"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_mis_conjuntos_administracion"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "apt_conjunto_fk"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_mis_conjuntos_con_suscripcion"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "apt_conjunto_fk"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_mis_conjuntos_seleccion"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "apt_conjunto_fk"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_pagos_detalle"
            referencedColumns: ["conjunto_id"]
          },
        ]
      }
      vista_asignacion_suscripciones: {
        Row: {
          conjunto_id: string | null
          email: string | null
          estado_conjunto: boolean | null
          estado_suscripcion:
            | Database["public"]["Enums"]["estado_suscripcion"]
            | null
          nombre_administrador: string | null
          nombre_conjunto: string | null
          phone_number: string | null
          suscripcion_id: string | null
          user_id: string | null
        }
        Relationships: []
      }
      vista_chats_usuario: {
        Row: {
          admin_apellido: string | null
          admin_foto: string | null
          admin_nombre: string | null
          admin_rol: string | null
          admin_user_id: string | null
          asunto: string | null
          chat_id: string | null
          conjunto_id: string | null
          created_at: string | null
          estado: Database["public"]["Enums"]["chat_estado_enum"] | null
          no_leidos_admin: number | null
          no_leidos_residente: number | null
          residente_apellido: string | null
          residente_foto: string | null
          residente_id: string | null
          residente_nombre: string | null
          residente_rol: string | null
          residente_user_id: string | null
          ultimo_mensaje: string | null
          ultimo_mensaje_fecha: string | null
          ultimo_mensaje_tipo: string | null
          updated_at: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chats_conjunto_id_fkey"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "conjuntos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chats_conjunto_id_fkey"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_asignacion_suscripciones"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "chats_conjunto_id_fkey"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_configuracion_actual"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "chats_conjunto_id_fkey"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_conjuntos_admin"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "chats_conjunto_id_fkey"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_dashbard_admin"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "chats_conjunto_id_fkey"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_dashboard_residente"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "chats_conjunto_id_fkey"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_editar_conjunto"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chats_conjunto_id_fkey"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_gestion_conjuntos"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "chats_conjunto_id_fkey"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_mis_conjuntos"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "chats_conjunto_id_fkey"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_mis_conjuntos_administracion"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "chats_conjunto_id_fkey"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_mis_conjuntos_con_suscripcion"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "chats_conjunto_id_fkey"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_mis_conjuntos_seleccion"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "chats_conjunto_id_fkey"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_pagos_detalle"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "chats_receptor_id_fkey"
            columns: ["admin_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chats_receptor_id_fkey"
            columns: ["admin_user_id"]
            isOneToOne: false
            referencedRelation: "vista_asignacion_suscripciones"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "chats_receptor_id_fkey"
            columns: ["admin_user_id"]
            isOneToOne: false
            referencedRelation: "vista_conjuntos_admin"
            referencedColumns: ["admin_id"]
          },
          {
            foreignKeyName: "chats_receptor_id_fkey"
            columns: ["admin_user_id"]
            isOneToOne: false
            referencedRelation: "vista_detalle_admin"
            referencedColumns: ["admin_id"]
          },
          {
            foreignKeyName: "chats_receptor_id_fkey"
            columns: ["admin_user_id"]
            isOneToOne: false
            referencedRelation: "vista_miembros_admin"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "chats_receptor_id_fkey"
            columns: ["admin_user_id"]
            isOneToOne: false
            referencedRelation: "vista_mis_balances_indicadores"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "chats_receptor_id_fkey"
            columns: ["admin_user_id"]
            isOneToOne: false
            referencedRelation: "vista_mis_residentes"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "chats_receptor_id_fkey"
            columns: ["admin_user_id"]
            isOneToOne: false
            referencedRelation: "vista_perfil"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "chats_receptor_id_fkey"
            columns: ["admin_user_id"]
            isOneToOne: false
            referencedRelation: "vista_perfil_administracion"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "chats_receptor_id_fkey"
            columns: ["admin_user_id"]
            isOneToOne: false
            referencedRelation: "vista_residentes_por_apartamento"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "chats_residente_id_fkey"
            columns: ["residente_id"]
            isOneToOne: false
            referencedRelation: "residentes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chats_residente_id_fkey"
            columns: ["residente_id"]
            isOneToOne: false
            referencedRelation: "vista_gestion_solicitudes"
            referencedColumns: ["id_residente"]
          },
          {
            foreignKeyName: "chats_residente_id_fkey"
            columns: ["residente_id"]
            isOneToOne: false
            referencedRelation: "vista_mis_balances_indicadores"
            referencedColumns: ["residente_id"]
          },
          {
            foreignKeyName: "chats_residente_id_fkey"
            columns: ["residente_id"]
            isOneToOne: false
            referencedRelation: "vista_mis_residentes"
            referencedColumns: ["residente_id"]
          },
          {
            foreignKeyName: "chats_residente_id_fkey"
            columns: ["residente_id"]
            isOneToOne: false
            referencedRelation: "vista_residente_completo"
            referencedColumns: ["residente_id"]
          },
          {
            foreignKeyName: "chats_residente_id_fkey"
            columns: ["residente_id"]
            isOneToOne: false
            referencedRelation: "vista_residentes_por_apartamento"
            referencedColumns: ["residente_id"]
          },
          {
            foreignKeyName: "chats_residente_id_fkey"
            columns: ["residente_id"]
            isOneToOne: false
            referencedRelation: "vista_saldos_por_concepto_residente"
            referencedColumns: ["residente_id"]
          },
          {
            foreignKeyName: "residente_user_fk"
            columns: ["residente_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "residente_user_fk"
            columns: ["residente_user_id"]
            isOneToOne: false
            referencedRelation: "vista_asignacion_suscripciones"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "residente_user_fk"
            columns: ["residente_user_id"]
            isOneToOne: false
            referencedRelation: "vista_conjuntos_admin"
            referencedColumns: ["admin_id"]
          },
          {
            foreignKeyName: "residente_user_fk"
            columns: ["residente_user_id"]
            isOneToOne: false
            referencedRelation: "vista_detalle_admin"
            referencedColumns: ["admin_id"]
          },
          {
            foreignKeyName: "residente_user_fk"
            columns: ["residente_user_id"]
            isOneToOne: false
            referencedRelation: "vista_miembros_admin"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "residente_user_fk"
            columns: ["residente_user_id"]
            isOneToOne: false
            referencedRelation: "vista_mis_balances_indicadores"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "residente_user_fk"
            columns: ["residente_user_id"]
            isOneToOne: false
            referencedRelation: "vista_mis_residentes"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "residente_user_fk"
            columns: ["residente_user_id"]
            isOneToOne: false
            referencedRelation: "vista_perfil"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "residente_user_fk"
            columns: ["residente_user_id"]
            isOneToOne: false
            referencedRelation: "vista_perfil_administracion"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "residente_user_fk"
            columns: ["residente_user_id"]
            isOneToOne: false
            referencedRelation: "vista_residentes_por_apartamento"
            referencedColumns: ["user_id"]
          },
        ]
      }
      vista_cobros_manuales: {
        Row: {
          cargos: number | null
          con_pagos: number | null
          concepto_codigo: string | null
          concepto_id: string | null
          concepto_nombre: string | null
          conjunto_id: string | null
          generado_en: string | null
          periodo: string | null
          total: number | null
          vence_el: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cargos_concepto_fk"
            columns: ["concepto_id"]
            isOneToOne: false
            referencedRelation: "conceptos_cobro"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cargos_concepto_fk"
            columns: ["concepto_id"]
            isOneToOne: false
            referencedRelation: "vista_saldos_por_concepto_residente"
            referencedColumns: ["concepto_id"]
          },
          {
            foreignKeyName: "cargos_mensuales_conjunto_id_fkey"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "conjuntos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cargos_mensuales_conjunto_id_fkey"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_asignacion_suscripciones"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "cargos_mensuales_conjunto_id_fkey"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_configuracion_actual"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "cargos_mensuales_conjunto_id_fkey"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_conjuntos_admin"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "cargos_mensuales_conjunto_id_fkey"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_dashbard_admin"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "cargos_mensuales_conjunto_id_fkey"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_dashboard_residente"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "cargos_mensuales_conjunto_id_fkey"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_editar_conjunto"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cargos_mensuales_conjunto_id_fkey"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_gestion_conjuntos"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "cargos_mensuales_conjunto_id_fkey"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_mis_conjuntos"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "cargos_mensuales_conjunto_id_fkey"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_mis_conjuntos_administracion"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "cargos_mensuales_conjunto_id_fkey"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_mis_conjuntos_con_suscripcion"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "cargos_mensuales_conjunto_id_fkey"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_mis_conjuntos_seleccion"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "cargos_mensuales_conjunto_id_fkey"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_pagos_detalle"
            referencedColumns: ["conjunto_id"]
          },
        ]
      }
      vista_configuracion_actual: {
        Row: {
          configuracion_id: string | null
          conjunto_id: string | null
          link_pago: string | null
          nombre_conjunto: string | null
          pronto_pago_dias: number | null
          pronto_pago_habilitado: boolean | null
          pronto_pago_porcentaje: number | null
          pronto_pago_tipo: string | null
          pronto_pago_valor: number | null
          valor_administracion: number | null
        }
        Relationships: []
      }
      vista_conjuntos_admin: {
        Row: {
          admin_id: string | null
          conjunto_id: string | null
          direccion_conjunto: string | null
          estado_suscripcion:
            | Database["public"]["Enums"]["estado_suscripcion"]
            | null
          fecha_vencimiento: string | null
          nombre_conjunto: string | null
          nombre_plan: string | null
          numero_apartamentos: number | null
        }
        Relationships: []
      }
      vista_dashbard_admin: {
        Row: {
          apartamentos_ocupados: number | null
          conjunto_id: string | null
          fecha_fin_suscripcion: string | null
          max_residentes_plan: number | null
          nombre_conjunto: string | null
          nombre_plan: string | null
          porcentaje_ocupacion: number | null
          porcentaje_uso_plan: number | null
          solicitudes_pendientes: number | null
          tipo_periodo: string | null
          total_apartamentos: number | null
          total_residentes: number | null
        }
        Insert: {
          apartamentos_ocupados?: never
          conjunto_id?: string | null
          fecha_fin_suscripcion?: never
          max_residentes_plan?: never
          nombre_conjunto?: string | null
          nombre_plan?: never
          porcentaje_ocupacion?: never
          porcentaje_uso_plan?: never
          solicitudes_pendientes?: never
          tipo_periodo?: never
          total_apartamentos?: never
          total_residentes?: never
        }
        Update: {
          apartamentos_ocupados?: never
          conjunto_id?: string | null
          fecha_fin_suscripcion?: never
          max_residentes_plan?: never
          nombre_conjunto?: string | null
          nombre_plan?: never
          porcentaje_ocupacion?: never
          porcentaje_uso_plan?: never
          solicitudes_pendientes?: never
          tipo_periodo?: never
          total_apartamentos?: never
          total_residentes?: never
        }
        Relationships: []
      }
      vista_dashboard_residente: {
        Row: {
          apartamento_id: string | null
          conjunto_id: string | null
          conjunto_nombre: string | null
          direccion_apartamento: string | null
          link_pago: string | null
          nombre_completo: string | null
          numero_apartamento: string | null
          proximo_vencimiento: string | null
          saldo_a_favor: number | null
          saldo_en_contra: number | null
          saldo_total: number | null
          ultimo_pago: string | null
          user_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "residente_user_fk"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "residente_user_fk"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "vista_asignacion_suscripciones"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "residente_user_fk"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "vista_conjuntos_admin"
            referencedColumns: ["admin_id"]
          },
          {
            foreignKeyName: "residente_user_fk"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "vista_detalle_admin"
            referencedColumns: ["admin_id"]
          },
          {
            foreignKeyName: "residente_user_fk"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "vista_miembros_admin"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "residente_user_fk"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "vista_mis_balances_indicadores"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "residente_user_fk"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "vista_mis_residentes"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "residente_user_fk"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "vista_perfil"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "residente_user_fk"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "vista_perfil_administracion"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "residente_user_fk"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "vista_residentes_por_apartamento"
            referencedColumns: ["user_id"]
          },
        ]
      }
      vista_departamentos: {
        Row: {
          codigo_departamento: string | null
          nombre_departamento: string | null
        }
        Relationships: []
      }
      vista_detalle_admin: {
        Row: {
          admin_id: string | null
          apellidos: string | null
          conjuntos_info: Json | null
          documento: string | null
          email: string | null
          estado: boolean | null
          nombres: string | null
          telefono: string | null
          ultimo_login: string | null
        }
        Relationships: []
      }
      vista_detalle_apt: {
        Row: {
          created_at: string | null
          direccion: string | null
          id_apt: string | null
          nombre_conjunto: string | null
          nombre_torre: string | null
          numero_apt: string | null
          numero_piso: number | null
          ocupado: boolean | null
          updated_at: string | null
        }
        Relationships: []
      }
      vista_detalle_solicitud: {
        Row: {
          admin_comentario: string | null
          costo: number | null
          descripcion: string | null
          estado: Database["public"]["Enums"]["solicitud_estado_enum"] | null
          fecha_atencion_solicitud: string | null
          fecha_atencion_viable: boolean | null
          fecha_preferida: string | null
          fecha_solicitud: string | null
          hora_atencion: string | null
          id_solicitud: string | null
          nombre_admin_asignado: string | null
          prioridad:
            | Database["public"]["Enums"]["solicitud_prioridad_enum"]
            | null
          tipo: Database["public"]["Enums"]["solicitud_tipo_enum"] | null
          titulo: string | null
          ubicacion: string | null
        }
        Relationships: []
      }
      vista_detalle_suscripciones: {
        Row: {
          admin_user_id: string | null
          conjunto_id: string | null
          estado: Database["public"]["Enums"]["estado_suscripcion"] | null
          fecha_fin: string | null
          fecha_inicio: string | null
          max_residentes: number | null
          metodo_pago: string | null
          nombre_plan: string | null
          plan_id: string | null
          precio_pagado: number | null
          referencia_pago: string | null
          suscripcion_id: string | null
          tipo_periodo: string | null
        }
        Relationships: [
          {
            foreignKeyName: "suscripciones_admin_fk"
            columns: ["admin_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "suscripciones_admin_fk"
            columns: ["admin_user_id"]
            isOneToOne: false
            referencedRelation: "vista_asignacion_suscripciones"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "suscripciones_admin_fk"
            columns: ["admin_user_id"]
            isOneToOne: false
            referencedRelation: "vista_conjuntos_admin"
            referencedColumns: ["admin_id"]
          },
          {
            foreignKeyName: "suscripciones_admin_fk"
            columns: ["admin_user_id"]
            isOneToOne: false
            referencedRelation: "vista_detalle_admin"
            referencedColumns: ["admin_id"]
          },
          {
            foreignKeyName: "suscripciones_admin_fk"
            columns: ["admin_user_id"]
            isOneToOne: false
            referencedRelation: "vista_miembros_admin"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "suscripciones_admin_fk"
            columns: ["admin_user_id"]
            isOneToOne: false
            referencedRelation: "vista_mis_balances_indicadores"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "suscripciones_admin_fk"
            columns: ["admin_user_id"]
            isOneToOne: false
            referencedRelation: "vista_mis_residentes"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "suscripciones_admin_fk"
            columns: ["admin_user_id"]
            isOneToOne: false
            referencedRelation: "vista_perfil"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "suscripciones_admin_fk"
            columns: ["admin_user_id"]
            isOneToOne: false
            referencedRelation: "vista_perfil_administracion"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "suscripciones_admin_fk"
            columns: ["admin_user_id"]
            isOneToOne: false
            referencedRelation: "vista_residentes_por_apartamento"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "suscripciones_conjunto_id_fkey"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "conjuntos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "suscripciones_conjunto_id_fkey"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_asignacion_suscripciones"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "suscripciones_conjunto_id_fkey"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_configuracion_actual"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "suscripciones_conjunto_id_fkey"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_conjuntos_admin"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "suscripciones_conjunto_id_fkey"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_dashbard_admin"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "suscripciones_conjunto_id_fkey"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_dashboard_residente"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "suscripciones_conjunto_id_fkey"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_editar_conjunto"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "suscripciones_conjunto_id_fkey"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_gestion_conjuntos"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "suscripciones_conjunto_id_fkey"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_mis_conjuntos"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "suscripciones_conjunto_id_fkey"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_mis_conjuntos_administracion"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "suscripciones_conjunto_id_fkey"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_mis_conjuntos_con_suscripcion"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "suscripciones_conjunto_id_fkey"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_mis_conjuntos_seleccion"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "suscripciones_conjunto_id_fkey"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_pagos_detalle"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "suscripciones_plan_fk"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "planes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "suscripciones_plan_fk"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "vista_historial_pagos_suscripcion"
            referencedColumns: ["plan_id"]
          },
          {
            foreignKeyName: "suscripciones_plan_fk"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "vista_pagos_detalle"
            referencedColumns: ["plan_id"]
          },
        ]
      }
      vista_editar_conjunto: {
        Row: {
          anio_construccion: number | null
          codigo_ciudad: string | null
          codigo_departamento: string | null
          direccion: string | null
          estrato: number | null
          foto_url: string | null
          id: string | null
          nombre: string | null
          nombre_ciudad: string | null
          nombre_departamento: string | null
          tiene_torres: boolean | null
          tipo_vivienda: string | null
          valor_administracion: number | null
        }
        Relationships: []
      }
      vista_envios_recepcion: {
        Row: {
          apartamento_id: string | null
          conjunto_id: string | null
          empresa_mensajeria: string | null
          entregado_por: string | null
          entregado_por_nombre: string | null
          estado: Database["public"]["Enums"]["estado_envio_enum"] | null
          fecha: string | null
          fecha_entrega: string | null
          id: string | null
          label_apartamento: string | null
          numero_apartamento: string | null
          numero_apartamento_num: number | null
          observaciones: string | null
          piso: number | null
          recibido_por: string | null
          registrado_por: string | null
          registrado_por_nombre: string | null
          torre_id: string | null
          torre_nombre: string | null
        }
        Relationships: [
          {
            foreignKeyName: "apt_conjunto_fk"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "conjuntos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "apt_conjunto_fk"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_asignacion_suscripciones"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "apt_conjunto_fk"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_configuracion_actual"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "apt_conjunto_fk"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_conjuntos_admin"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "apt_conjunto_fk"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_dashbard_admin"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "apt_conjunto_fk"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_dashboard_residente"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "apt_conjunto_fk"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_editar_conjunto"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "apt_conjunto_fk"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_gestion_conjuntos"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "apt_conjunto_fk"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_mis_conjuntos"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "apt_conjunto_fk"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_mis_conjuntos_administracion"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "apt_conjunto_fk"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_mis_conjuntos_con_suscripcion"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "apt_conjunto_fk"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_mis_conjuntos_seleccion"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "apt_conjunto_fk"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_pagos_detalle"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "envios_entregado_por_fkey"
            columns: ["entregado_por"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "envios_entregado_por_fkey"
            columns: ["entregado_por"]
            isOneToOne: false
            referencedRelation: "vista_asignacion_suscripciones"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "envios_entregado_por_fkey"
            columns: ["entregado_por"]
            isOneToOne: false
            referencedRelation: "vista_conjuntos_admin"
            referencedColumns: ["admin_id"]
          },
          {
            foreignKeyName: "envios_entregado_por_fkey"
            columns: ["entregado_por"]
            isOneToOne: false
            referencedRelation: "vista_detalle_admin"
            referencedColumns: ["admin_id"]
          },
          {
            foreignKeyName: "envios_entregado_por_fkey"
            columns: ["entregado_por"]
            isOneToOne: false
            referencedRelation: "vista_miembros_admin"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "envios_entregado_por_fkey"
            columns: ["entregado_por"]
            isOneToOne: false
            referencedRelation: "vista_mis_balances_indicadores"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "envios_entregado_por_fkey"
            columns: ["entregado_por"]
            isOneToOne: false
            referencedRelation: "vista_mis_residentes"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "envios_entregado_por_fkey"
            columns: ["entregado_por"]
            isOneToOne: false
            referencedRelation: "vista_perfil"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "envios_entregado_por_fkey"
            columns: ["entregado_por"]
            isOneToOne: false
            referencedRelation: "vista_perfil_administracion"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "envios_entregado_por_fkey"
            columns: ["entregado_por"]
            isOneToOne: false
            referencedRelation: "vista_residentes_por_apartamento"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "envios_registrado_por_fkey"
            columns: ["registrado_por"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "envios_registrado_por_fkey"
            columns: ["registrado_por"]
            isOneToOne: false
            referencedRelation: "vista_asignacion_suscripciones"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "envios_registrado_por_fkey"
            columns: ["registrado_por"]
            isOneToOne: false
            referencedRelation: "vista_conjuntos_admin"
            referencedColumns: ["admin_id"]
          },
          {
            foreignKeyName: "envios_registrado_por_fkey"
            columns: ["registrado_por"]
            isOneToOne: false
            referencedRelation: "vista_detalle_admin"
            referencedColumns: ["admin_id"]
          },
          {
            foreignKeyName: "envios_registrado_por_fkey"
            columns: ["registrado_por"]
            isOneToOne: false
            referencedRelation: "vista_miembros_admin"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "envios_registrado_por_fkey"
            columns: ["registrado_por"]
            isOneToOne: false
            referencedRelation: "vista_mis_balances_indicadores"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "envios_registrado_por_fkey"
            columns: ["registrado_por"]
            isOneToOne: false
            referencedRelation: "vista_mis_residentes"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "envios_registrado_por_fkey"
            columns: ["registrado_por"]
            isOneToOne: false
            referencedRelation: "vista_perfil"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "envios_registrado_por_fkey"
            columns: ["registrado_por"]
            isOneToOne: false
            referencedRelation: "vista_perfil_administracion"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "envios_registrado_por_fkey"
            columns: ["registrado_por"]
            isOneToOne: false
            referencedRelation: "vista_residentes_por_apartamento"
            referencedColumns: ["user_id"]
          },
        ]
      }
      vista_gestion_conjuntos: {
        Row: {
          conjunto_id: string | null
          direccion: string | null
          estado: string | null
          estrato: number | null
          foto_url: string | null
          nombre_conjunto: string | null
          num_admins: number | null
          num_viviendas: number | null
          tipo_viviendas: string | null
        }
        Relationships: []
      }
      vista_gestion_solicitudes: {
        Row: {
          conjunto_id: string | null
          estado: Database["public"]["Enums"]["solicitud_estado_enum"] | null
          fecha: string | null
          id_residente: string | null
          id_solicitud: string | null
          nombre_admin_asignado: string | null
          nombre_residente: string | null
          numero_apartamento: string | null
          prioridad:
            | Database["public"]["Enums"]["solicitud_prioridad_enum"]
            | null
          tipo_solicitud:
            | Database["public"]["Enums"]["solicitud_tipo_enum"]
            | null
          titulo: string | null
          ubicacion: string | null
        }
        Relationships: [
          {
            foreignKeyName: "solicitudes_conjunto_fk"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "conjuntos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "solicitudes_conjunto_fk"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_asignacion_suscripciones"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "solicitudes_conjunto_fk"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_configuracion_actual"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "solicitudes_conjunto_fk"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_conjuntos_admin"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "solicitudes_conjunto_fk"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_dashbard_admin"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "solicitudes_conjunto_fk"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_dashboard_residente"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "solicitudes_conjunto_fk"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_editar_conjunto"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "solicitudes_conjunto_fk"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_gestion_conjuntos"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "solicitudes_conjunto_fk"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_mis_conjuntos"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "solicitudes_conjunto_fk"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_mis_conjuntos_administracion"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "solicitudes_conjunto_fk"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_mis_conjuntos_con_suscripcion"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "solicitudes_conjunto_fk"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_mis_conjuntos_seleccion"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "solicitudes_conjunto_fk"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_pagos_detalle"
            referencedColumns: ["conjunto_id"]
          },
        ]
      }
      vista_gestion_solicitudes_detalle: {
        Row: {
          admin_conjunto_id: string | null
          admin_user_id: string | null
          apartamento_id: string | null
          comentario_administrador: string | null
          conjunto_id: string | null
          costo: number | null
          descripcion: string | null
          email: string | null
          estado_solicitud:
            | Database["public"]["Enums"]["solicitud_estado_enum"]
            | null
          fecha_atencion_viable: boolean | null
          fecha_preferida_residente: string | null
          fecha_programada: string | null
          fecha_solicitud: string | null
          hora: string | null
          id_solicitud: string | null
          nombre_admin_asignado: string | null
          nombre_residente: string | null
          numero_apartamento: string | null
          phone_number: string | null
          prioridad:
            | Database["public"]["Enums"]["solicitud_prioridad_enum"]
            | null
          tipo_solicitud:
            | Database["public"]["Enums"]["solicitud_tipo_enum"]
            | null
          titulo: string | null
          ubicacion: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_admins_conjuntos_user"
            columns: ["admin_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_admins_conjuntos_user"
            columns: ["admin_user_id"]
            isOneToOne: false
            referencedRelation: "vista_asignacion_suscripciones"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "fk_admins_conjuntos_user"
            columns: ["admin_user_id"]
            isOneToOne: false
            referencedRelation: "vista_conjuntos_admin"
            referencedColumns: ["admin_id"]
          },
          {
            foreignKeyName: "fk_admins_conjuntos_user"
            columns: ["admin_user_id"]
            isOneToOne: false
            referencedRelation: "vista_detalle_admin"
            referencedColumns: ["admin_id"]
          },
          {
            foreignKeyName: "fk_admins_conjuntos_user"
            columns: ["admin_user_id"]
            isOneToOne: false
            referencedRelation: "vista_miembros_admin"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "fk_admins_conjuntos_user"
            columns: ["admin_user_id"]
            isOneToOne: false
            referencedRelation: "vista_mis_balances_indicadores"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "fk_admins_conjuntos_user"
            columns: ["admin_user_id"]
            isOneToOne: false
            referencedRelation: "vista_mis_residentes"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "fk_admins_conjuntos_user"
            columns: ["admin_user_id"]
            isOneToOne: false
            referencedRelation: "vista_perfil"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "fk_admins_conjuntos_user"
            columns: ["admin_user_id"]
            isOneToOne: false
            referencedRelation: "vista_perfil_administracion"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "fk_admins_conjuntos_user"
            columns: ["admin_user_id"]
            isOneToOne: false
            referencedRelation: "vista_residentes_por_apartamento"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "residente_apto_fk"
            columns: ["apartamento_id"]
            isOneToOne: false
            referencedRelation: "apartamentos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "residente_apto_fk"
            columns: ["apartamento_id"]
            isOneToOne: false
            referencedRelation: "vista_apartamentos_recepcion"
            referencedColumns: ["apartamento_id"]
          },
          {
            foreignKeyName: "residente_apto_fk"
            columns: ["apartamento_id"]
            isOneToOne: false
            referencedRelation: "vista_dashboard_residente"
            referencedColumns: ["apartamento_id"]
          },
          {
            foreignKeyName: "residente_apto_fk"
            columns: ["apartamento_id"]
            isOneToOne: false
            referencedRelation: "vista_detalle_apt"
            referencedColumns: ["id_apt"]
          },
          {
            foreignKeyName: "residente_apto_fk"
            columns: ["apartamento_id"]
            isOneToOne: false
            referencedRelation: "vista_envios_recepcion"
            referencedColumns: ["apartamento_id"]
          },
          {
            foreignKeyName: "residente_apto_fk"
            columns: ["apartamento_id"]
            isOneToOne: false
            referencedRelation: "vista_mis_balances_indicadores"
            referencedColumns: ["apartamento_id"]
          },
          {
            foreignKeyName: "residente_apto_fk"
            columns: ["apartamento_id"]
            isOneToOne: false
            referencedRelation: "vista_mis_residentes"
            referencedColumns: ["apartamento_id"]
          },
          {
            foreignKeyName: "residente_apto_fk"
            columns: ["apartamento_id"]
            isOneToOne: false
            referencedRelation: "vista_visitas_recepcion"
            referencedColumns: ["apartamento_id"]
          },
          {
            foreignKeyName: "solicitudes_conjunto_fk"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "conjuntos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "solicitudes_conjunto_fk"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_asignacion_suscripciones"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "solicitudes_conjunto_fk"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_configuracion_actual"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "solicitudes_conjunto_fk"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_conjuntos_admin"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "solicitudes_conjunto_fk"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_dashbard_admin"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "solicitudes_conjunto_fk"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_dashboard_residente"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "solicitudes_conjunto_fk"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_editar_conjunto"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "solicitudes_conjunto_fk"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_gestion_conjuntos"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "solicitudes_conjunto_fk"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_mis_conjuntos"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "solicitudes_conjunto_fk"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_mis_conjuntos_administracion"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "solicitudes_conjunto_fk"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_mis_conjuntos_con_suscripcion"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "solicitudes_conjunto_fk"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_mis_conjuntos_seleccion"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "solicitudes_conjunto_fk"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_pagos_detalle"
            referencedColumns: ["conjunto_id"]
          },
        ]
      }
      vista_gestion_torres: {
        Row: {
          aptos_por_piso: number | null
          conjunto_id: string | null
          created_at: string | null
          id: string | null
          nombre_conjunto: string | null
          nombre_torre: string | null
          pisos: number | null
          promedio_apts_torre: number | null
          promedio_pisos: number | null
          total_apartamentos: number | null
          total_torres: number | null
          updated_at: string | null
        }
        Relationships: [
          {
            foreignKeyName: "torres_conjunto_fk"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "conjuntos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "torres_conjunto_fk"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_asignacion_suscripciones"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "torres_conjunto_fk"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_configuracion_actual"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "torres_conjunto_fk"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_conjuntos_admin"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "torres_conjunto_fk"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_dashbard_admin"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "torres_conjunto_fk"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_dashboard_residente"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "torres_conjunto_fk"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_editar_conjunto"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "torres_conjunto_fk"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_gestion_conjuntos"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "torres_conjunto_fk"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_mis_conjuntos"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "torres_conjunto_fk"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_mis_conjuntos_administracion"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "torres_conjunto_fk"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_mis_conjuntos_con_suscripcion"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "torres_conjunto_fk"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_mis_conjuntos_seleccion"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "torres_conjunto_fk"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_pagos_detalle"
            referencedColumns: ["conjunto_id"]
          },
        ]
      }
      vista_historial_pagos_suscripcion: {
        Row: {
          admin_user_id: string | null
          conjunto_id: string | null
          created_at: string | null
          estado_pago: Database["public"]["Enums"]["estado_pago"] | null
          estado_suscripcion:
            | Database["public"]["Enums"]["estado_suscripcion"]
            | null
          fecha_fin: string | null
          fecha_inicio: string | null
          fecha_pago: string | null
          metodo_pago: string | null
          monto: number | null
          nombre_plan: string | null
          pago_id: string | null
          plan_id: string | null
          referencia_externa: string | null
          subtipo_plan: string | null
          suscripcion_id: string | null
          tipo_periodo: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pagos_suscripcion_id_fkey"
            columns: ["suscripcion_id"]
            isOneToOne: false
            referencedRelation: "suscripciones"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pagos_suscripcion_id_fkey"
            columns: ["suscripcion_id"]
            isOneToOne: false
            referencedRelation: "vista_asignacion_suscripciones"
            referencedColumns: ["suscripcion_id"]
          },
          {
            foreignKeyName: "pagos_suscripcion_id_fkey"
            columns: ["suscripcion_id"]
            isOneToOne: false
            referencedRelation: "vista_detalle_suscripciones"
            referencedColumns: ["suscripcion_id"]
          },
          {
            foreignKeyName: "pagos_suscripcion_id_fkey"
            columns: ["suscripcion_id"]
            isOneToOne: false
            referencedRelation: "vista_pagos_detalle"
            referencedColumns: ["suscripcion_id"]
          },
          {
            foreignKeyName: "pagos_suscripcion_id_fkey"
            columns: ["suscripcion_id"]
            isOneToOne: false
            referencedRelation: "vista_superadmin_nuevas_suscripciones"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "suscripciones_admin_fk"
            columns: ["admin_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "suscripciones_admin_fk"
            columns: ["admin_user_id"]
            isOneToOne: false
            referencedRelation: "vista_asignacion_suscripciones"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "suscripciones_admin_fk"
            columns: ["admin_user_id"]
            isOneToOne: false
            referencedRelation: "vista_conjuntos_admin"
            referencedColumns: ["admin_id"]
          },
          {
            foreignKeyName: "suscripciones_admin_fk"
            columns: ["admin_user_id"]
            isOneToOne: false
            referencedRelation: "vista_detalle_admin"
            referencedColumns: ["admin_id"]
          },
          {
            foreignKeyName: "suscripciones_admin_fk"
            columns: ["admin_user_id"]
            isOneToOne: false
            referencedRelation: "vista_miembros_admin"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "suscripciones_admin_fk"
            columns: ["admin_user_id"]
            isOneToOne: false
            referencedRelation: "vista_mis_balances_indicadores"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "suscripciones_admin_fk"
            columns: ["admin_user_id"]
            isOneToOne: false
            referencedRelation: "vista_mis_residentes"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "suscripciones_admin_fk"
            columns: ["admin_user_id"]
            isOneToOne: false
            referencedRelation: "vista_perfil"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "suscripciones_admin_fk"
            columns: ["admin_user_id"]
            isOneToOne: false
            referencedRelation: "vista_perfil_administracion"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "suscripciones_admin_fk"
            columns: ["admin_user_id"]
            isOneToOne: false
            referencedRelation: "vista_residentes_por_apartamento"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "suscripciones_conjunto_id_fkey"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "conjuntos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "suscripciones_conjunto_id_fkey"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_asignacion_suscripciones"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "suscripciones_conjunto_id_fkey"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_configuracion_actual"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "suscripciones_conjunto_id_fkey"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_conjuntos_admin"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "suscripciones_conjunto_id_fkey"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_dashbard_admin"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "suscripciones_conjunto_id_fkey"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_dashboard_residente"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "suscripciones_conjunto_id_fkey"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_editar_conjunto"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "suscripciones_conjunto_id_fkey"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_gestion_conjuntos"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "suscripciones_conjunto_id_fkey"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_mis_conjuntos"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "suscripciones_conjunto_id_fkey"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_mis_conjuntos_administracion"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "suscripciones_conjunto_id_fkey"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_mis_conjuntos_con_suscripcion"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "suscripciones_conjunto_id_fkey"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_mis_conjuntos_seleccion"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "suscripciones_conjunto_id_fkey"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_pagos_detalle"
            referencedColumns: ["conjunto_id"]
          },
        ]
      }
      vista_miembros_admin: {
        Row: {
          activo: boolean | null
          apellidos: string | null
          conjunto_id: string | null
          email: string | null
          es_propietario: boolean | null
          estado: boolean | null
          fecha_asignacion: string | null
          foto_url: string | null
          nombres: string | null
          rol: string | null
          user_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_admins_conjuntos_conjunto"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "conjuntos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_admins_conjuntos_conjunto"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_asignacion_suscripciones"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "fk_admins_conjuntos_conjunto"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_configuracion_actual"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "fk_admins_conjuntos_conjunto"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_conjuntos_admin"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "fk_admins_conjuntos_conjunto"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_dashbard_admin"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "fk_admins_conjuntos_conjunto"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_dashboard_residente"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "fk_admins_conjuntos_conjunto"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_editar_conjunto"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_admins_conjuntos_conjunto"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_gestion_conjuntos"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "fk_admins_conjuntos_conjunto"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_mis_conjuntos"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "fk_admins_conjuntos_conjunto"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_mis_conjuntos_administracion"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "fk_admins_conjuntos_conjunto"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_mis_conjuntos_con_suscripcion"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "fk_admins_conjuntos_conjunto"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_mis_conjuntos_seleccion"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "fk_admins_conjuntos_conjunto"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_pagos_detalle"
            referencedColumns: ["conjunto_id"]
          },
        ]
      }
      vista_mis_balances_historial2: {
        Row: {
          apartamento_id: string | null
          concepto_cargo: string | null
          conjunto_id: string | null
          credito: number | null
          debito: number | null
          fecha_movimiento: string | null
          fecha_vencimiento: string | null
          movimiento_tipo: string | null
          origen_pago: string | null
          periodo: string | null
          residente_id: string | null
          user_id: string | null
        }
        Relationships: []
      }
      vista_mis_balances_indicadores: {
        Row: {
          apartamento_id: string | null
          conjunto_id: string | null
          proximo_vencimiento: string | null
          residente_id: string | null
          saldo_a_favor: number | null
          saldo_en_contra: number | null
          saldo_total: number | null
          ultimo_pago: string | null
          user_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "apt_conjunto_fk"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "conjuntos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "apt_conjunto_fk"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_asignacion_suscripciones"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "apt_conjunto_fk"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_configuracion_actual"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "apt_conjunto_fk"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_conjuntos_admin"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "apt_conjunto_fk"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_dashbard_admin"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "apt_conjunto_fk"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_dashboard_residente"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "apt_conjunto_fk"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_editar_conjunto"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "apt_conjunto_fk"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_gestion_conjuntos"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "apt_conjunto_fk"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_mis_conjuntos"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "apt_conjunto_fk"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_mis_conjuntos_administracion"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "apt_conjunto_fk"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_mis_conjuntos_con_suscripcion"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "apt_conjunto_fk"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_mis_conjuntos_seleccion"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "apt_conjunto_fk"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_pagos_detalle"
            referencedColumns: ["conjunto_id"]
          },
        ]
      }
      vista_mis_conjuntos: {
        Row: {
          conjunto_id: string | null
          estado_suscripcion:
            | Database["public"]["Enums"]["estado_suscripcion"]
            | null
          fecha_fin_suscripcion: string | null
          fecha_inicio_suscripcion: string | null
          nombre_conjunto: string | null
          nombre_plan: string | null
          periodo_plan: string | null
          plan_id: string | null
          precio_suscripcion: number | null
          user_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_admins_conjuntos_user"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_admins_conjuntos_user"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "vista_asignacion_suscripciones"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "fk_admins_conjuntos_user"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "vista_conjuntos_admin"
            referencedColumns: ["admin_id"]
          },
          {
            foreignKeyName: "fk_admins_conjuntos_user"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "vista_detalle_admin"
            referencedColumns: ["admin_id"]
          },
          {
            foreignKeyName: "fk_admins_conjuntos_user"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "vista_miembros_admin"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "fk_admins_conjuntos_user"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "vista_mis_balances_indicadores"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "fk_admins_conjuntos_user"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "vista_mis_residentes"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "fk_admins_conjuntos_user"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "vista_perfil"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "fk_admins_conjuntos_user"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "vista_perfil_administracion"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "fk_admins_conjuntos_user"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "vista_residentes_por_apartamento"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "suscripciones_plan_fk"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "planes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "suscripciones_plan_fk"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "vista_historial_pagos_suscripcion"
            referencedColumns: ["plan_id"]
          },
          {
            foreignKeyName: "suscripciones_plan_fk"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "vista_pagos_detalle"
            referencedColumns: ["plan_id"]
          },
        ]
      }
      vista_mis_conjuntos_administracion: {
        Row: {
          cantidad_admins: number | null
          cantidad_apartamentos: number | null
          ciudad: string | null
          conjunto_id: string | null
          direccion: string | null
          estado: boolean | null
          estrato: number | null
          foto_url: string | null
          nombre: string | null
          tipo_vivienda: string | null
          user_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_admins_conjuntos_user"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_admins_conjuntos_user"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "vista_asignacion_suscripciones"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "fk_admins_conjuntos_user"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "vista_conjuntos_admin"
            referencedColumns: ["admin_id"]
          },
          {
            foreignKeyName: "fk_admins_conjuntos_user"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "vista_detalle_admin"
            referencedColumns: ["admin_id"]
          },
          {
            foreignKeyName: "fk_admins_conjuntos_user"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "vista_miembros_admin"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "fk_admins_conjuntos_user"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "vista_mis_balances_indicadores"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "fk_admins_conjuntos_user"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "vista_mis_residentes"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "fk_admins_conjuntos_user"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "vista_perfil"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "fk_admins_conjuntos_user"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "vista_perfil_administracion"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "fk_admins_conjuntos_user"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "vista_residentes_por_apartamento"
            referencedColumns: ["user_id"]
          },
        ]
      }
      vista_mis_conjuntos_con_suscripcion: {
        Row: {
          admin_user_id: string | null
          anio_construccion: number | null
          ciudad: string | null
          conjunto_id: string | null
          direccion: string | null
          estado: string | null
          estado_suscripcion:
            | Database["public"]["Enums"]["estado_suscripcion"]
            | null
          estrato: number | null
          fecha_creacion: string | null
          fecha_fin: string | null
          fecha_inicio: string | null
          metodo_pago: string | null
          nombre: string | null
          nombre_plan: string | null
          num_viviendas: number | null
          precio_pagado: number | null
          referencia_pago: string | null
          tipo_periodo: string | null
          tipo_vivienda: string | null
          ultima_actualizacion: string | null
          valor_administracion: number | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_admins_conjuntos_user"
            columns: ["admin_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_admins_conjuntos_user"
            columns: ["admin_user_id"]
            isOneToOne: false
            referencedRelation: "vista_asignacion_suscripciones"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "fk_admins_conjuntos_user"
            columns: ["admin_user_id"]
            isOneToOne: false
            referencedRelation: "vista_conjuntos_admin"
            referencedColumns: ["admin_id"]
          },
          {
            foreignKeyName: "fk_admins_conjuntos_user"
            columns: ["admin_user_id"]
            isOneToOne: false
            referencedRelation: "vista_detalle_admin"
            referencedColumns: ["admin_id"]
          },
          {
            foreignKeyName: "fk_admins_conjuntos_user"
            columns: ["admin_user_id"]
            isOneToOne: false
            referencedRelation: "vista_miembros_admin"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "fk_admins_conjuntos_user"
            columns: ["admin_user_id"]
            isOneToOne: false
            referencedRelation: "vista_mis_balances_indicadores"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "fk_admins_conjuntos_user"
            columns: ["admin_user_id"]
            isOneToOne: false
            referencedRelation: "vista_mis_residentes"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "fk_admins_conjuntos_user"
            columns: ["admin_user_id"]
            isOneToOne: false
            referencedRelation: "vista_perfil"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "fk_admins_conjuntos_user"
            columns: ["admin_user_id"]
            isOneToOne: false
            referencedRelation: "vista_perfil_administracion"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "fk_admins_conjuntos_user"
            columns: ["admin_user_id"]
            isOneToOne: false
            referencedRelation: "vista_residentes_por_apartamento"
            referencedColumns: ["user_id"]
          },
        ]
      }
      vista_mis_conjuntos_seleccion: {
        Row: {
          conjunto_id: string | null
          foto_url: string | null
          nombre: string | null
          user_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_admins_conjuntos_user"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_admins_conjuntos_user"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "vista_asignacion_suscripciones"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "fk_admins_conjuntos_user"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "vista_conjuntos_admin"
            referencedColumns: ["admin_id"]
          },
          {
            foreignKeyName: "fk_admins_conjuntos_user"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "vista_detalle_admin"
            referencedColumns: ["admin_id"]
          },
          {
            foreignKeyName: "fk_admins_conjuntos_user"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "vista_miembros_admin"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "fk_admins_conjuntos_user"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "vista_mis_balances_indicadores"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "fk_admins_conjuntos_user"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "vista_mis_residentes"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "fk_admins_conjuntos_user"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "vista_perfil"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "fk_admins_conjuntos_user"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "vista_perfil_administracion"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "fk_admins_conjuntos_user"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "vista_residentes_por_apartamento"
            referencedColumns: ["user_id"]
          },
        ]
      }
      vista_mis_residentes: {
        Row: {
          activo: boolean | null
          apartamento_descripcion: string | null
          apartamento_id: string | null
          apartamento_numero: string | null
          conjunto_id: string | null
          contacto: string | null
          documento: string | null
          email: string | null
          estado_usuario: boolean | null
          estrato: number | null
          nombre_completo: string | null
          residente_id: string | null
          tipo_documento: string | null
          torre_nombre: string | null
          user_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "residente_conjunto_fk"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "conjuntos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "residente_conjunto_fk"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_asignacion_suscripciones"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "residente_conjunto_fk"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_configuracion_actual"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "residente_conjunto_fk"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_conjuntos_admin"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "residente_conjunto_fk"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_dashbard_admin"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "residente_conjunto_fk"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_dashboard_residente"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "residente_conjunto_fk"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_editar_conjunto"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "residente_conjunto_fk"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_gestion_conjuntos"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "residente_conjunto_fk"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_mis_conjuntos"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "residente_conjunto_fk"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_mis_conjuntos_administracion"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "residente_conjunto_fk"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_mis_conjuntos_con_suscripcion"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "residente_conjunto_fk"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_mis_conjuntos_seleccion"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "residente_conjunto_fk"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_pagos_detalle"
            referencedColumns: ["conjunto_id"]
          },
        ]
      }
      vista_mis_solicitudes: {
        Row: {
          asignado_a: string | null
          conjunto_id: string | null
          costo: number | null
          descripcion: string | null
          estado: Database["public"]["Enums"]["solicitud_estado_enum"] | null
          fecha_atencion_solicitud: string | null
          fecha_solicitud: string | null
          hora_atencion: string | null
          id_solicitud: string | null
          prioridad:
            | Database["public"]["Enums"]["solicitud_prioridad_enum"]
            | null
          residente_id: string | null
          tipo_solicitud:
            | Database["public"]["Enums"]["solicitud_tipo_enum"]
            | null
          titulo: string | null
          ubicacion: string | null
        }
        Relationships: [
          {
            foreignKeyName: "solicitudes_conjunto_fk"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "conjuntos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "solicitudes_conjunto_fk"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_asignacion_suscripciones"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "solicitudes_conjunto_fk"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_configuracion_actual"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "solicitudes_conjunto_fk"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_conjuntos_admin"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "solicitudes_conjunto_fk"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_dashbard_admin"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "solicitudes_conjunto_fk"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_dashboard_residente"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "solicitudes_conjunto_fk"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_editar_conjunto"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "solicitudes_conjunto_fk"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_gestion_conjuntos"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "solicitudes_conjunto_fk"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_mis_conjuntos"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "solicitudes_conjunto_fk"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_mis_conjuntos_administracion"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "solicitudes_conjunto_fk"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_mis_conjuntos_con_suscripcion"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "solicitudes_conjunto_fk"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_mis_conjuntos_seleccion"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "solicitudes_conjunto_fk"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_pagos_detalle"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "solicitudes_residente_fk"
            columns: ["residente_id"]
            isOneToOne: false
            referencedRelation: "residentes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "solicitudes_residente_fk"
            columns: ["residente_id"]
            isOneToOne: false
            referencedRelation: "vista_gestion_solicitudes"
            referencedColumns: ["id_residente"]
          },
          {
            foreignKeyName: "solicitudes_residente_fk"
            columns: ["residente_id"]
            isOneToOne: false
            referencedRelation: "vista_mis_balances_indicadores"
            referencedColumns: ["residente_id"]
          },
          {
            foreignKeyName: "solicitudes_residente_fk"
            columns: ["residente_id"]
            isOneToOne: false
            referencedRelation: "vista_mis_residentes"
            referencedColumns: ["residente_id"]
          },
          {
            foreignKeyName: "solicitudes_residente_fk"
            columns: ["residente_id"]
            isOneToOne: false
            referencedRelation: "vista_residente_completo"
            referencedColumns: ["residente_id"]
          },
          {
            foreignKeyName: "solicitudes_residente_fk"
            columns: ["residente_id"]
            isOneToOne: false
            referencedRelation: "vista_residentes_por_apartamento"
            referencedColumns: ["residente_id"]
          },
          {
            foreignKeyName: "solicitudes_residente_fk"
            columns: ["residente_id"]
            isOneToOne: false
            referencedRelation: "vista_saldos_por_concepto_residente"
            referencedColumns: ["residente_id"]
          },
        ]
      }
      vista_notificaciones_residente: {
        Row: {
          content: string | null
          created_at: string | null
          estado_visita:
            | Database["public"]["Enums"]["estado_visita_enum"]
            | null
          id_notification: number | null
          id_visita: string | null
          leida: boolean | null
          title: string | null
          userIds: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "notifications_visita_fk"
            columns: ["id_visita"]
            isOneToOne: false
            referencedRelation: "visitas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_visita_fk"
            columns: ["id_visita"]
            isOneToOne: false
            referencedRelation: "vista_visitas_recepcion"
            referencedColumns: ["id"]
          },
        ]
      }
      vista_pagos_detalle: {
        Row: {
          conjunto_id: string | null
          estado_pago: Database["public"]["Enums"]["estado_pago"] | null
          estado_suscripcion:
            | Database["public"]["Enums"]["estado_suscripcion"]
            | null
          fecha_creacion_pago: string | null
          fecha_pago: string | null
          metodo_pago: string | null
          monto: number | null
          nombre_conjunto: string | null
          nombre_plan: string | null
          pago_id: string | null
          plan_id: string | null
          referencia_externa: string | null
          suscripcion_id: string | null
          tipo_periodo: string | null
        }
        Relationships: []
      }
      vista_perfil: {
        Row: {
          apellido: string | null
          created_at: string | null
          direccion: string | null
          documento: string | null
          email: string | null
          estado: boolean | null
          foto_url: string | null
          nombre: string | null
          numero_apto: string | null
          telefono: string | null
          tipo_documento: string | null
          user_id: string | null
        }
        Relationships: []
      }
      vista_perfil_administracion: {
        Row: {
          apellido: string | null
          conjunto_id: string | null
          created_at: string | null
          direccion: string | null
          documento: string | null
          email: string | null
          estado: boolean | null
          foto_url: string | null
          nombre: string | null
          nombre_conjunto: string | null
          numero_apto: string | null
          telefono: string | null
          tipo_documento: string | null
          user_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_admins_conjuntos_conjunto"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "conjuntos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_admins_conjuntos_conjunto"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_asignacion_suscripciones"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "fk_admins_conjuntos_conjunto"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_configuracion_actual"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "fk_admins_conjuntos_conjunto"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_conjuntos_admin"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "fk_admins_conjuntos_conjunto"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_dashbard_admin"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "fk_admins_conjuntos_conjunto"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_dashboard_residente"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "fk_admins_conjuntos_conjunto"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_editar_conjunto"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_admins_conjuntos_conjunto"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_gestion_conjuntos"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "fk_admins_conjuntos_conjunto"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_mis_conjuntos"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "fk_admins_conjuntos_conjunto"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_mis_conjuntos_administracion"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "fk_admins_conjuntos_conjunto"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_mis_conjuntos_con_suscripcion"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "fk_admins_conjuntos_conjunto"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_mis_conjuntos_seleccion"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "fk_admins_conjuntos_conjunto"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_pagos_detalle"
            referencedColumns: ["conjunto_id"]
          },
        ]
      }
      vista_personas_apartamento: {
        Row: {
          apartamento_id: string | null
          email: string | null
          nombres_completos: string | null
          numero_apartamento: string | null
          tipo_persona: string | null
        }
        Relationships: []
      }
      vista_residente_completo: {
        Row: {
          ano_ingreso: number | null
          apartamento_id: string | null
          apellidos: string | null
          conjunto_id: string | null
          convivientes: Json | null
          direccion_personal: string | null
          direccion_unidad: string | null
          documento: string | null
          email: string | null
          empleados_servicio: Json | null
          estado: boolean | null
          estrato: number | null
          foto_url: string | null
          mascotas: Json | null
          nombre_conjunto: string | null
          nombres: string | null
          numero_apartamento: string | null
          phone_number: string | null
          residente_id: string | null
          rol: string | null
          tipo_documento: string | null
          user_id: string | null
          vehiculos: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "residente_apto_fk"
            columns: ["apartamento_id"]
            isOneToOne: false
            referencedRelation: "apartamentos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "residente_apto_fk"
            columns: ["apartamento_id"]
            isOneToOne: false
            referencedRelation: "vista_apartamentos_recepcion"
            referencedColumns: ["apartamento_id"]
          },
          {
            foreignKeyName: "residente_apto_fk"
            columns: ["apartamento_id"]
            isOneToOne: false
            referencedRelation: "vista_dashboard_residente"
            referencedColumns: ["apartamento_id"]
          },
          {
            foreignKeyName: "residente_apto_fk"
            columns: ["apartamento_id"]
            isOneToOne: false
            referencedRelation: "vista_detalle_apt"
            referencedColumns: ["id_apt"]
          },
          {
            foreignKeyName: "residente_apto_fk"
            columns: ["apartamento_id"]
            isOneToOne: false
            referencedRelation: "vista_envios_recepcion"
            referencedColumns: ["apartamento_id"]
          },
          {
            foreignKeyName: "residente_apto_fk"
            columns: ["apartamento_id"]
            isOneToOne: false
            referencedRelation: "vista_mis_balances_indicadores"
            referencedColumns: ["apartamento_id"]
          },
          {
            foreignKeyName: "residente_apto_fk"
            columns: ["apartamento_id"]
            isOneToOne: false
            referencedRelation: "vista_mis_residentes"
            referencedColumns: ["apartamento_id"]
          },
          {
            foreignKeyName: "residente_apto_fk"
            columns: ["apartamento_id"]
            isOneToOne: false
            referencedRelation: "vista_visitas_recepcion"
            referencedColumns: ["apartamento_id"]
          },
          {
            foreignKeyName: "residente_conjunto_fk"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "conjuntos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "residente_conjunto_fk"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_asignacion_suscripciones"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "residente_conjunto_fk"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_configuracion_actual"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "residente_conjunto_fk"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_conjuntos_admin"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "residente_conjunto_fk"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_dashbard_admin"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "residente_conjunto_fk"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_dashboard_residente"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "residente_conjunto_fk"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_editar_conjunto"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "residente_conjunto_fk"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_gestion_conjuntos"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "residente_conjunto_fk"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_mis_conjuntos"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "residente_conjunto_fk"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_mis_conjuntos_administracion"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "residente_conjunto_fk"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_mis_conjuntos_con_suscripcion"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "residente_conjunto_fk"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_mis_conjuntos_seleccion"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "residente_conjunto_fk"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_pagos_detalle"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "residente_user_fk"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "residente_user_fk"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "vista_asignacion_suscripciones"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "residente_user_fk"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "vista_conjuntos_admin"
            referencedColumns: ["admin_id"]
          },
          {
            foreignKeyName: "residente_user_fk"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "vista_detalle_admin"
            referencedColumns: ["admin_id"]
          },
          {
            foreignKeyName: "residente_user_fk"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "vista_miembros_admin"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "residente_user_fk"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "vista_mis_balances_indicadores"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "residente_user_fk"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "vista_mis_residentes"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "residente_user_fk"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "vista_perfil"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "residente_user_fk"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "vista_perfil_administracion"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "residente_user_fk"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "vista_residentes_por_apartamento"
            referencedColumns: ["user_id"]
          },
        ]
      }
      vista_residentes_convivientes: {
        Row: {
          apartamento_id: string | null
          conviviente_apellidos: string | null
          conviviente_nombres: string | null
          direccion: string | null
          direccion_apartamento: string | null
          email: string | null
          estado: boolean | null
          fecha_nacimiento: string | null
          numero_apartamento: string | null
          parentesco: string | null
          phone_number: string | null
          residente_id: string | null
          rol: string | null
          tipo_persona: string | null
          user_apellidos: string | null
          user_id: string | null
          user_nombres: string | null
        }
        Relationships: []
      }
      vista_residentes_por_apartamento: {
        Row: {
          apartamento_id: string | null
          contacto: string | null
          nombre_completo: string | null
          residente_id: string | null
          rol: string | null
          user_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "residente_apto_fk"
            columns: ["apartamento_id"]
            isOneToOne: false
            referencedRelation: "apartamentos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "residente_apto_fk"
            columns: ["apartamento_id"]
            isOneToOne: false
            referencedRelation: "vista_apartamentos_recepcion"
            referencedColumns: ["apartamento_id"]
          },
          {
            foreignKeyName: "residente_apto_fk"
            columns: ["apartamento_id"]
            isOneToOne: false
            referencedRelation: "vista_dashboard_residente"
            referencedColumns: ["apartamento_id"]
          },
          {
            foreignKeyName: "residente_apto_fk"
            columns: ["apartamento_id"]
            isOneToOne: false
            referencedRelation: "vista_detalle_apt"
            referencedColumns: ["id_apt"]
          },
          {
            foreignKeyName: "residente_apto_fk"
            columns: ["apartamento_id"]
            isOneToOne: false
            referencedRelation: "vista_envios_recepcion"
            referencedColumns: ["apartamento_id"]
          },
          {
            foreignKeyName: "residente_apto_fk"
            columns: ["apartamento_id"]
            isOneToOne: false
            referencedRelation: "vista_mis_balances_indicadores"
            referencedColumns: ["apartamento_id"]
          },
          {
            foreignKeyName: "residente_apto_fk"
            columns: ["apartamento_id"]
            isOneToOne: false
            referencedRelation: "vista_mis_residentes"
            referencedColumns: ["apartamento_id"]
          },
          {
            foreignKeyName: "residente_apto_fk"
            columns: ["apartamento_id"]
            isOneToOne: false
            referencedRelation: "vista_visitas_recepcion"
            referencedColumns: ["apartamento_id"]
          },
        ]
      }
      vista_saldos_por_concepto_residente: {
        Row: {
          apartamento_id: string | null
          codigo: string | null
          concepto_id: string | null
          nombre: string | null
          proximo_vencimiento: string | null
          residente_id: string | null
          saldo: number | null
          total_cargos: number | null
          total_pagado: number | null
          user_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "residente_apto_fk"
            columns: ["apartamento_id"]
            isOneToOne: false
            referencedRelation: "apartamentos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "residente_apto_fk"
            columns: ["apartamento_id"]
            isOneToOne: false
            referencedRelation: "vista_apartamentos_recepcion"
            referencedColumns: ["apartamento_id"]
          },
          {
            foreignKeyName: "residente_apto_fk"
            columns: ["apartamento_id"]
            isOneToOne: false
            referencedRelation: "vista_dashboard_residente"
            referencedColumns: ["apartamento_id"]
          },
          {
            foreignKeyName: "residente_apto_fk"
            columns: ["apartamento_id"]
            isOneToOne: false
            referencedRelation: "vista_detalle_apt"
            referencedColumns: ["id_apt"]
          },
          {
            foreignKeyName: "residente_apto_fk"
            columns: ["apartamento_id"]
            isOneToOne: false
            referencedRelation: "vista_envios_recepcion"
            referencedColumns: ["apartamento_id"]
          },
          {
            foreignKeyName: "residente_apto_fk"
            columns: ["apartamento_id"]
            isOneToOne: false
            referencedRelation: "vista_mis_balances_indicadores"
            referencedColumns: ["apartamento_id"]
          },
          {
            foreignKeyName: "residente_apto_fk"
            columns: ["apartamento_id"]
            isOneToOne: false
            referencedRelation: "vista_mis_residentes"
            referencedColumns: ["apartamento_id"]
          },
          {
            foreignKeyName: "residente_apto_fk"
            columns: ["apartamento_id"]
            isOneToOne: false
            referencedRelation: "vista_visitas_recepcion"
            referencedColumns: ["apartamento_id"]
          },
          {
            foreignKeyName: "residente_user_fk"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "residente_user_fk"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "vista_asignacion_suscripciones"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "residente_user_fk"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "vista_conjuntos_admin"
            referencedColumns: ["admin_id"]
          },
          {
            foreignKeyName: "residente_user_fk"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "vista_detalle_admin"
            referencedColumns: ["admin_id"]
          },
          {
            foreignKeyName: "residente_user_fk"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "vista_miembros_admin"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "residente_user_fk"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "vista_mis_balances_indicadores"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "residente_user_fk"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "vista_mis_residentes"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "residente_user_fk"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "vista_perfil"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "residente_user_fk"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "vista_perfil_administracion"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "residente_user_fk"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "vista_residentes_por_apartamento"
            referencedColumns: ["user_id"]
          },
        ]
      }
      vista_superadmin_kpis: {
        Row: {
          ingresos_mes_actual: number | null
          total_admins: number | null
          total_conjuntos: number | null
        }
        Relationships: []
      }
      vista_superadmin_nuevas_suscripciones: {
        Row: {
          estado: Database["public"]["Enums"]["estado_suscripcion"] | null
          fecha_suscripcion: string | null
          id: string | null
          nombre_conjunto: string | null
          nombre_plan: string | null
          precio_pagado: number | null
          tipo_periodo: string | null
        }
        Relationships: []
      }
      vista_visitas_recepcion: {
        Row: {
          apartamento_id: string | null
          autorizado_por: string | null
          autorizado_por_nombre: string | null
          autorizado_por_rol: string | null
          conjunto_id: string | null
          estado_autorizacion:
            | Database["public"]["Enums"]["estado_visita_enum"]
            | null
          fecha: string | null
          fecha_autorizacion: string | null
          id: string | null
          label_apartamento: string | null
          motivo: string | null
          nombres: string | null
          numero_apartamento: string | null
          numero_apartamento_num: number | null
          observaciones: string | null
          piso: number | null
          registrado_por: string | null
          registrado_por_nombre: string | null
          telefono: string | null
          torre_id: string | null
          torre_nombre: string | null
        }
        Relationships: [
          {
            foreignKeyName: "apt_conjunto_fk"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "conjuntos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "apt_conjunto_fk"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_asignacion_suscripciones"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "apt_conjunto_fk"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_configuracion_actual"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "apt_conjunto_fk"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_conjuntos_admin"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "apt_conjunto_fk"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_dashbard_admin"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "apt_conjunto_fk"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_dashboard_residente"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "apt_conjunto_fk"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_editar_conjunto"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "apt_conjunto_fk"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_gestion_conjuntos"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "apt_conjunto_fk"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_mis_conjuntos"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "apt_conjunto_fk"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_mis_conjuntos_administracion"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "apt_conjunto_fk"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_mis_conjuntos_con_suscripcion"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "apt_conjunto_fk"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_mis_conjuntos_seleccion"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "apt_conjunto_fk"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "vista_pagos_detalle"
            referencedColumns: ["conjunto_id"]
          },
          {
            foreignKeyName: "visitas_registrado_por_fkey"
            columns: ["registrado_por"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "visitas_registrado_por_fkey"
            columns: ["registrado_por"]
            isOneToOne: false
            referencedRelation: "vista_asignacion_suscripciones"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "visitas_registrado_por_fkey"
            columns: ["registrado_por"]
            isOneToOne: false
            referencedRelation: "vista_conjuntos_admin"
            referencedColumns: ["admin_id"]
          },
          {
            foreignKeyName: "visitas_registrado_por_fkey"
            columns: ["registrado_por"]
            isOneToOne: false
            referencedRelation: "vista_detalle_admin"
            referencedColumns: ["admin_id"]
          },
          {
            foreignKeyName: "visitas_registrado_por_fkey"
            columns: ["registrado_por"]
            isOneToOne: false
            referencedRelation: "vista_miembros_admin"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "visitas_registrado_por_fkey"
            columns: ["registrado_por"]
            isOneToOne: false
            referencedRelation: "vista_mis_balances_indicadores"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "visitas_registrado_por_fkey"
            columns: ["registrado_por"]
            isOneToOne: false
            referencedRelation: "vista_mis_residentes"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "visitas_registrado_por_fkey"
            columns: ["registrado_por"]
            isOneToOne: false
            referencedRelation: "vista_perfil"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "visitas_registrado_por_fkey"
            columns: ["registrado_por"]
            isOneToOne: false
            referencedRelation: "vista_perfil_administracion"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "visitas_registrado_por_fkey"
            columns: ["registrado_por"]
            isOneToOne: false
            referencedRelation: "vista_residentes_por_apartamento"
            referencedColumns: ["user_id"]
          },
        ]
      }
    }
    Functions: {
      actualizar_estados_suscripciones: { Args: never; Returns: undefined }
      agregar_o_actualizar_piso: {
        Args: {
          p_aptos_en_piso: number
          p_conjunto_id: string
          p_piso: number
          p_torre_id: string
        }
        Returns: undefined
      }
      agregar_pisos_a_torre: {
        Args: {
          p_aptos_por_piso: number
          p_pisos_nuevos: number
          p_torre_id: string
        }
        Returns: number
      }
      ajustar_apartamentos_de_piso: {
        Args: { p_aptos_objetivo: number; p_torre_piso_id: string }
        Returns: Json
      }
      aplicar_recaudo: { Args: { p_recaudo_id: string }; Returns: undefined }
      bytea_to_text: { Args: { data: string }; Returns: string }
      crear_cobro_manual: {
        Args: {
          p_apartamento_id: string
          p_concepto_codigo: string
          p_conjunto_id: string
          p_fecha_vencimiento: string
          p_periodo: string
          p_valor: number
        }
        Returns: {
          apartamentos: number
          creados: number
        }[]
      }
      crear_cobro_solicitud: {
        Args: {
          p_fecha_vencimiento?: string
          p_solicitud_id: string
          p_valor: number
        }
        Returns: {
          cargo_id: string
          creado: boolean
        }[]
      }
      crear_envio: {
        Args: {
          p_apartamento_id: string
          p_empresa_mensajeria: string
          p_enviado_por: string
          p_observaciones: string
        }
        Returns: string
      }
      crear_torre_con_pisos: {
        Args: {
          p_aptos_por_piso: number
          p_conjunto_id: string
          p_direccion_base?: string
          p_nombre: string
          p_num_pisos: number
          p_prefijo: string
        }
        Returns: string
      }
      crear_visita: {
        Args: {
          p_apartamento_id: string
          p_enviado_por: string
          p_motivo: string
          p_nombres: string
          p_observaciones: string
          p_telefono: string
        }
        Returns: string
      }
      eliminar_torre_si_vacia: { Args: { p_torre_id: string }; Returns: number }
      estado_suscripcion_por_fecha: {
        Args: { p_fecha_fin: string }
        Returns: Database["public"]["Enums"]["estado_suscripcion"]
      }
      generar_apartamentos_sin_torres: {
        Args: { payload: Json }
        Returns: {
          conjunto_id: string
          created_at: string | null
          direccion: string
          generado_automatico: boolean
          id: string
          numero_apartamento: string
          numero_apartamento_num: number | null
          ocupado: boolean
          torre_id: string | null
          torre_piso_id: string | null
          updated_at: string | null
        }[]
        SetofOptions: {
          from: "*"
          to: "apartamentos"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      generar_cargos_mensuales: {
        Args: { p_periodo: string }
        Returns: undefined
      }
      generar_cargos_mensuales_cron: { Args: never; Returns: undefined }
      generar_pisos_y_apartamentos: {
        Args: {
          p_aptos_por_piso?: number
          p_conjunto_id: string
          p_num_pisos: number
          p_torre_id: string
        }
        Returns: undefined
      }
      get_admin_suscripciones: {
        Args: never
        Returns: {
          admin_user_id: string
          conjunto_estado: string
          conjunto_id: string
          conjunto_nombre: string
          email: string
          fecha_fin: string
          nombre: string
          phone_number: string
          plan: string
          suscripcion_estado: string
        }[]
      }
      get_mis_conjuntos: {
        Args: { p_user_id: string }
        Returns: {
          activo: boolean
          anio_construccion: number
          areas_comunes: Json
          ciudad: string
          codigo_municipio: string
          created_at: string
          direccion: string
          estado: string
          estrato: number
          foto_url: string
          id: string
          nombre: string
          num_admins: number
          num_viviendas: number
          tiene_torres: boolean
          tipo_vivienda: string
          updated_at: string
          valor_administracion: number
        }[]
      }
      get_mis_residentes: {
        Args: { p_user_id: string }
        Returns: {
          ano_ingreso: number
          apartamento: string
          apellidos: string
          cedula: string
          conjunto_id: string
          conjunto_nombre: string
          direccion_unidad: string
          email: string
          estado: boolean
          nombres: string
          residente_id: string
          telefono: string
        }[]
      }
      http: {
        Args: { request: Database["public"]["CompositeTypes"]["http_request"] }
        Returns: Database["public"]["CompositeTypes"]["http_response"]
        SetofOptions: {
          from: "http_request"
          to: "http_response"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      http_delete:
        | {
            Args: { uri: string }
            Returns: Database["public"]["CompositeTypes"]["http_response"]
            SetofOptions: {
              from: "*"
              to: "http_response"
              isOneToOne: true
              isSetofReturn: false
            }
          }
        | {
            Args: { content: string; content_type: string; uri: string }
            Returns: Database["public"]["CompositeTypes"]["http_response"]
            SetofOptions: {
              from: "*"
              to: "http_response"
              isOneToOne: true
              isSetofReturn: false
            }
          }
      http_get:
        | {
            Args: { uri: string }
            Returns: Database["public"]["CompositeTypes"]["http_response"]
            SetofOptions: {
              from: "*"
              to: "http_response"
              isOneToOne: true
              isSetofReturn: false
            }
          }
        | {
            Args: { data: Json; uri: string }
            Returns: Database["public"]["CompositeTypes"]["http_response"]
            SetofOptions: {
              from: "*"
              to: "http_response"
              isOneToOne: true
              isSetofReturn: false
            }
          }
      http_head: {
        Args: { uri: string }
        Returns: Database["public"]["CompositeTypes"]["http_response"]
        SetofOptions: {
          from: "*"
          to: "http_response"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      http_header: {
        Args: { field: string; value: string }
        Returns: Database["public"]["CompositeTypes"]["http_header"]
        SetofOptions: {
          from: "*"
          to: "http_header"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      http_list_curlopt: {
        Args: never
        Returns: {
          curlopt: string
          value: string
        }[]
      }
      http_patch: {
        Args: { content: string; content_type: string; uri: string }
        Returns: Database["public"]["CompositeTypes"]["http_response"]
        SetofOptions: {
          from: "*"
          to: "http_response"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      http_post:
        | {
            Args: { content: string; content_type: string; uri: string }
            Returns: Database["public"]["CompositeTypes"]["http_response"]
            SetofOptions: {
              from: "*"
              to: "http_response"
              isOneToOne: true
              isSetofReturn: false
            }
          }
        | {
            Args: { data: Json; uri: string }
            Returns: Database["public"]["CompositeTypes"]["http_response"]
            SetofOptions: {
              from: "*"
              to: "http_response"
              isOneToOne: true
              isSetofReturn: false
            }
          }
      http_put: {
        Args: { content: string; content_type: string; uri: string }
        Returns: Database["public"]["CompositeTypes"]["http_response"]
        SetofOptions: {
          from: "*"
          to: "http_response"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      http_reset_curlopt: { Args: never; Returns: boolean }
      http_set_curlopt: {
        Args: { curlopt: string; value: string }
        Returns: boolean
      }
      revertir_cobro_manual: {
        Args: {
          p_concepto_codigo: string
          p_conjunto_id: string
          p_periodo: string
        }
        Returns: {
          bloqueados: number
          eliminados: number
        }[]
      }
      text_to_bytea: { Args: { data: string }; Returns: string }
      urlencode:
        | { Args: { data: Json }; Returns: string }
        | {
            Args: { string: string }
            Returns: {
              error: true
            } & "Could not choose the best candidate function between: public.urlencode(string => bytea), public.urlencode(string => varchar). Try renaming the parameters or the function itself in the database so function overloading can be resolved"
          }
        | {
            Args: { string: string }
            Returns: {
              error: true
            } & "Could not choose the best candidate function between: public.urlencode(string => bytea), public.urlencode(string => varchar). Try renaming the parameters or the function itself in the database so function overloading can be resolved"
          }
    }
    Enums: {
      chat_estado_enum: "Activo" | "Finalizado"
      estado_envio_enum: "pendiente" | "entregado"
      estado_pago: "pendiente" | "aprobado" | "rechazado" | "expirado"
      estado_suscripcion: "activa" | "proxima" | "vencida" | "bloqueada"
      estado_visita_enum: "pendiente" | "aprobado" | "rechazado"
      solicitud_estado_enum:
        | "pendientes"
        | "asignadas"
        | "en_proceso"
        | "completadas"
        | "canceladas"
      solicitud_prioridad_enum: "baja" | "media" | "alta"
      solicitud_tipo_enum:
        | "Mantenimiento"
        | "Seguridad"
        | "Administraci├│n"
        | "Parqueaderos"
        | "Otros"
      tipo_comunicado_enum: "Comunicado" | "Reporte"
      tipo_novedad_enum: "Pagos" | "Multas" | "Balances" | "Novedad"
      tipo_periodo: "mensual" | "trimestral" | "anual"
    }
    CompositeTypes: {
      http_header: {
        field: string | null
        value: string | null
      }
      http_request: {
        method: unknown
        uri: string | null
        headers: Database["public"]["CompositeTypes"]["http_header"][] | null
        content_type: string | null
        content: string | null
      }
      http_response: {
        status: number | null
        content_type: string | null
        headers: Database["public"]["CompositeTypes"]["http_header"][] | null
        content: string | null
      }
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      chat_estado_enum: ["Activo", "Finalizado"],
      estado_envio_enum: ["pendiente", "entregado"],
      estado_pago: ["pendiente", "aprobado", "rechazado", "expirado"],
      estado_suscripcion: ["activa", "proxima", "vencida", "bloqueada"],
      estado_visita_enum: ["pendiente", "aprobado", "rechazado"],
      solicitud_estado_enum: [
        "pendientes",
        "asignadas",
        "en_proceso",
        "completadas",
        "canceladas",
      ],
      solicitud_prioridad_enum: ["baja", "media", "alta"],
      solicitud_tipo_enum: [
        "Mantenimiento",
        "Seguridad",
        "Administraci├│n",
        "Parqueaderos",
        "Otros",
      ],
      tipo_comunicado_enum: ["Comunicado", "Reporte"],
      tipo_novedad_enum: ["Pagos", "Multas", "Balances", "Novedad"],
      tipo_periodo: ["mensual", "trimestral", "anual"],
    },
  },
} as const
