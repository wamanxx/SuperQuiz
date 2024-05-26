import 'react-native-url-polyfill/auto'

import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://xbilvfajrksachkycoui.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhiaWx2ZmFqcmtzYWNoa3ljb3VpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTM1NjI3NjAsImV4cCI6MjAyOTEzODc2MH0.dqdphDmkwIXvAKMZKJ0fqkhiq54NIsRHgGAkskDAoEA"

import { Database } from "@/lib/database"

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})