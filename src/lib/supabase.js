import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Chỉ tạo kết nối khi đã khai báo biến môi trường. Giao diện vẫn chạy ở chế độ demo.
export const supabase = url && anonKey ? createClient(url, anonKey) : null
