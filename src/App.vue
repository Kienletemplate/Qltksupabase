<script setup>
import { computed, onMounted, ref } from 'vue'
import {
  Activity, ArrowDown, ArrowLeft, ArrowRight, Bell, CalendarDays, Check, CheckCircle2,
  ChevronDown, ChevronRight, CircleHelp, Clock3, Eye, EyeOff, KeyRound, LayoutDashboard,
  LockKeyhole, LogOut, Menu, MoreHorizontal, Plus, Search, Settings2, Shield, ShieldCheck,
  SlidersHorizontal, Sparkles, User, UserCheck, UserCog, Users, X, RefreshCw,
} from 'lucide-vue-next'
import { supabase } from './lib/supabase'

const page = ref('login')
const activeTab = ref('Tổng quan')
const activeNav = ref('Tổng quan')
const menuOpen = ref(false)
const showPassword = ref(false)
const loginId = ref('')
const password = ref('')
const loginError = ref('')
const searchText = ref('')
const showUserModal = ref(false)
const toast = ref('')
const loading = ref(false)
const today = new Intl.DateTimeFormat('vi-VN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(new Date())

const users = ref([
  { name: 'Admin', email: 'admin@admin.com', username: 'admin', role: 'Quản trị viên', status: 'Đang hoạt động', last: 'Vừa xong', initials: 'A', color: 'violet' },
])
const activity = ref([
  { title: 'Đăng nhập thành công', detail: 'admin', time: '23:43', kind: 'success' },
  { title: 'Đăng xuất', detail: 'admin@admin.com', time: '23:43', kind: 'info' },
  { title: 'Cập nhật hồ sơ', detail: 'admin@admin.com', time: 'Hôm qua', kind: 'violet' },
])
const filteredUsers = computed(() => users.value.filter(u => `${u.name} ${u.email} ${u.username} ${u.role}`.toLowerCase().includes(searchText.value.toLowerCase())))
const lockedCount = computed(() => users.value.filter(u => u.status === 'Tạm khóa').length)

function notify(message) {
  toast.value = message
  window.setTimeout(() => { toast.value = '' }, 2600)
}
async function signIn() {
  loginError.value = ''
  if (!loginId.value.trim() || !password.value) { loginError.value = 'Vui lòng nhập email và mật khẩu.'; return }
  loading.value = true
  try {
    if (supabase) {
      const { error } = await supabase.auth.signInWithPassword({ email: loginId.value, password: password.value })
      if (error) throw error
    } else if (password.value.length < 4) {
      throw new Error('Mật khẩu demo cần có ít nhất 4 ký tự.')
    }
    activity.value.unshift({ title: 'Đăng nhập thành công', detail: loginId.value, time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }), kind: 'success' })
    page.value = 'dashboard'
  } catch (error) { loginError.value = error.message || 'Không thể đăng nhập. Vui lòng thử lại.' }
  finally { loading.value = false }
}
async function resetPassword() {
  if (!loginId.value.trim()) { loginError.value = 'Nhập email để nhận liên kết đặt lại mật khẩu.'; return }
  if (supabase) {
    const { error } = await supabase.auth.resetPasswordForEmail(loginId.value)
    if (error) { loginError.value = error.message; return }
  }
  loginError.value = ''
  notify('Đã gửi hướng dẫn đặt lại mật khẩu nếu email tồn tại.')
}
async function signOut() {
  if (supabase) await supabase.auth.signOut()
  page.value = 'login'
  menuOpen.value = false
  password.value = ''
}
function openSection(section) {
  activeNav.value = section
  activeTab.value = section
}
function addUser() {
  const next = users.value.length + 1
  users.value.push({ name: `Người dùng ${next}`, email: `user${next}@company.vn`, username: `user${next}`, role: 'Thành viên', status: 'Đang hoạt động', last: 'Chưa đăng nhập', initials: `U${next}`, color: 'blue' })
  showUserModal.value = false
  activeNav.value = 'Người dùng'
  activeTab.value = 'Người dùng'
  notify('Đã thêm người dùng mẫu.')
}
function refresh() { notify('Dữ liệu đã được làm mới.') }
onMounted(async () => {
  if (!supabase) return
  const { data: { session } } = await supabase.auth.getSession()
  if (session) page.value = 'dashboard'
})
</script>

<template>
  <main v-if="page === 'login'" class="login-shell">
    <section class="login-story">
      <a class="brand" href="#" aria-label="Unify"><span class="brand-mark"><span></span><i></i></span><span><b>Unify</b><small>ACCOUNT<br />WORKSPACE</small></span></a>
      <div class="story-copy">
        <p class="eyebrow">MỘT KHÔNG GIAN. MỌI KẾT NỐI.</p>
        <h1>Quản lý dễ dàng.<br />Kết nối <span>an tâm.</span></h1>
        <p class="story-description">Con người, vai trò và quyền truy cập.<br />Tất cả trong một không gian làm việc tinh gọn.</p>
      </div>
      <div class="orbit-art" aria-hidden="true">
        <div class="orbit orbit-one"></div><div class="orbit orbit-two"></div>
        <div class="orbit-center"><ShieldCheck :size="60" stroke-width="1.6" /></div>
        <div class="float-card float-people"><Users :size="25"/><span>Con người<strong>Là trung tâm</strong></span></div>
        <div class="float-card float-access"><LockKeyhole :size="23"/><span>Quyền truy cập<strong>Trong tầm tay</strong></span></div>
        <i class="spark spark-a"></i><i class="spark spark-b"></i>
      </div>
      <p class="workspace-note"><i></i> Không gian làm việc dành cho đội ngũ của bạn.</p>
      <span class="story-glow"></span>
    </section>
    <section class="login-panel-wrap">
      <form class="login-panel" @submit.prevent="signIn">
        <p class="eyebrow">CHÀO MỪNG TRỞ LẠI</p>
        <h2>Đăng nhập</h2>
        <p class="panel-subtitle">Tiếp tục vào không gian làm việc của bạn.</p>
        <label for="login-id">Email hoặc tên đăng nhập</label>
        <div class="input-wrap"><User :size="19"/><input id="login-id" v-model="loginId" autocomplete="username" placeholder="Nhập email hoặc tên đăng nhập" /></div>
        <label for="login-password">Mật khẩu</label>
        <div class="input-wrap"><LockKeyhole :size="19"/><input id="login-password" v-model="password" :type="showPassword ? 'text' : 'password'" autocomplete="current-password" placeholder="Nhập mật khẩu của bạn"/><button type="button" class="icon-button" aria-label="Hiện hoặc ẩn mật khẩu" @click="showPassword = !showPassword"><EyeOff v-if="showPassword" :size="19"/><Eye v-else :size="19"/></button></div>
        <div class="forgot-row"><button type="button" class="text-button" @click="resetPassword">Quên mật khẩu?</button></div>
        <p v-if="loginError" class="form-error">{{ loginError }}</p>
        <button class="primary-button login-submit" type="submit" :disabled="loading">{{ loading ? 'Đang đăng nhập…' : 'Vào không gian làm việc' }}<ArrowRight :size="21"/></button>
        <div class="panel-foot"><Shield :size="16"/> Quyền truy cập được quản lý bởi đội ngũ của bạn.</div>
      </form>
    </section>
    <div v-if="toast" class="toast"><CheckCircle2 :size="18"/>{{ toast }}</div>
  </main>

  <main v-else class="app-shell">
    <aside class="sidebar" :class="{ 'sidebar-open': menuOpen }">
      <a class="brand sidebar-brand" href="#"><span class="brand-mark"><span></span><i></i></span><span><b>Unify</b><small>ACCOUNT<br />WORKSPACE</small></span></a>
      <p class="nav-caption">KHÔNG GIAN QUẢN LÝ</p>
      <nav class="side-nav">
        <button v-for="item in [
          {name:'Tổng quan', icon:LayoutDashboard}, {name:'Người dùng', icon:Users}, {name:'Vai trò & phân quyền', icon:ShieldCheck}, {name:'Nhật ký hoạt động', icon:Activity}, {name:'Cấp lại mật khẩu', icon:KeyRound}
        ]" :key="item.name" class="nav-item" :class="{selected:activeNav===item.name}" @click="openSection(item.name)"><component :is="item.icon" :size="22"/><span>{{ item.name }}</span><ChevronRight v-if="activeNav===item.name" class="nav-chevron" :size="18"/></button>
      </nav>
      <div class="sidebar-bottom"><div class="help-card"><span class="help-icon"><CircleHelp :size="18"/></span><div><b>Cần trợ giúp?</b><small>Trung tâm hỗ trợ</small></div><ArrowRight :size="16"/></div><div class="sidebar-version">Unify Workspace <span>v1.0</span></div></div>
    </aside>
    <section class="workspace">
      <header class="topbar">
        <button class="icon-button menu-toggle" aria-label="Mở menu" @click="menuOpen=!menuOpen"><Menu :size="21"/></button>
        <label class="global-search"><Search :size="20"/><input v-model="searchText" placeholder="Tìm kiếm người dùng..."/><kbd>↵</kbd></label>
        <div class="topbar-actions"><span class="online-status"><i></i> Không gian làm việc</span><button class="icon-button notification" aria-label="Thông báo" @click="notify('Bạn đã xem hết thông báo mới.')"><Bell :size="21"/><i></i></button><div class="profile-menu"><button class="avatar-button" @click="menuOpen=!menuOpen">A <ChevronDown :size="15"/></button><div v-if="menuOpen" class="profile-popover"><div class="popover-user"><div class="avatar small">A</div><span><b>Admin</b><small>admin@admin.com</small></span></div><button @click="notify('Hồ sơ tài khoản')"><UserCog :size="17"/> Hồ sơ tài khoản</button><button @click="signOut"><LogOut :size="17"/> Đăng xuất</button></div></div></div>
      </header>
      <div class="content-area">
        <div class="breadcrumb"><span>Không gian làm việc</span><ChevronRight :size="16"/><b>{{ activeNav }}</b><time>{{ today }}</time></div>
        <div class="tabs-bar"><div class="tab-list"><button v-for="tab in ['Tổng quan','Người dùng','Vai trò & phân quyền','Nhật ký hoạt động']" :key="tab" :class="{active:activeTab===tab}" @click="openSection(tab)">{{ tab }}</button></div><span class="date-stamp"><CalendarDays :size="17"/> 08/11/2026</span></div>

        <template v-if="activeNav==='Tổng quan'">
          <section class="page-heading"><div><p class="eyebrow">MỌI THỨ TRONG TẦM TAY</p><h1>Tổng quan không gian làm việc<span>.</span></h1><p>Một góc nhìn rõ ràng về con người, quyền truy cập và hoạt động.</p></div><button class="secondary-button" @click="refresh"><RefreshCw :size="17"/> Làm mới</button></section>
          <section class="stat-grid">
            <article class="stat-card stat-violet"><span class="stat-icon"><Users :size="24"/></span><div><h3>Tổng người dùng</h3><strong>{{ users.length }}</strong><p>Trong không gian làm việc</p></div><Sparkles class="stat-spark" :size="28"/></article>
            <article class="stat-card stat-blue"><span class="stat-icon"><UserCheck :size="23"/></span><div><h3>Đang hoạt động</h3><strong>{{ users.length-lockedCount }}</strong><p>{{ users.length ? Math.round((users.length-lockedCount)/users.length*100) : 0 }}% tổng số tài khoản</p></div><Sparkles class="stat-spark" :size="28"/></article>
            <article class="stat-card stat-peach"><span class="stat-icon"><ShieldCheck :size="25"/></span><div><h3>Vai trò đang dùng</h3><strong>{{ new Set(users.map(u=>u.role)).size }}</strong><p>{{ users.length }} tài khoản đã được gán vai trò</p></div><Sparkles class="stat-spark" :size="28"/></article>
            <article class="stat-card stat-mint"><span class="stat-icon"><UserCog :size="24"/></span><div><h3>Tài khoản tạm khóa</h3><strong>{{ lockedCount }}</strong><p>{{ lockedCount ? 'Cần xem xét quyền truy cập' : 'Tất cả tài khoản đều hoạt động' }}</p></div><Sparkles class="stat-spark" :size="28"/></article>
          </section>
          <section class="dashboard-grid">
            <article class="surface activity-chart"><div class="surface-title"><div><h2>Hoạt động hệ thống</h2><p>Trong 100 bản ghi gần nhất</p></div><button class="select-like" @click="notify('Đang xem dữ liệu 7 ngày qua')">7 ngày qua <ChevronDown :size="14"/></button></div><div class="chart-area"><div class="chart-y"><span>3</span><span>2</span><span>1</span><span>0</span></div><div class="chart-plot"><div class="chart-gridline"></div><div class="chart-gridline"></div><div class="chart-gridline"></div><svg viewBox="0 0 520 155" preserveAspectRatio="none" aria-label="Biểu đồ hoạt động"><defs><linearGradient id="fill" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#8e61d1" stop-opacity=".22"/><stop offset="1" stop-color="#8e61d1" stop-opacity="0"/></linearGradient></defs><path d="M0 145 L90 145 L175 145 L260 145 L350 145 L430 145 L520 30 L520 155 L0 155Z" fill="url(#fill)"/><path d="M0 145 L90 145 L175 145 L260 145 L350 145 L430 145 L520 30" fill="none" stroke="#8053b0" stroke-width="3"/><circle cx="520" cy="30" r="4" fill="#8053b0"/></svg><div class="chart-x"><span>03/11</span><span>05/11</span><span>07/11</span><span>09/11</span></div></div></div></article>
            <article class="surface status-panel"><div class="surface-title"><h2>Trạng thái tài khoản</h2><span class="chart-mark">◴</span></div><div class="status-content"><div class="donut"><div><b>{{ users.length }}</b><span>Tài khoản</span></div></div><div class="legend"><p><i class="dot active-dot"></i>Hoạt động <b>{{ users.length-lockedCount }}</b></p><p><i class="dot locked-dot"></i>Tạm khóa <b>{{ lockedCount }}</b></p></div></div></article>
            <article class="surface recent-panel"><div class="surface-title"><h2>Hoạt động gần đây</h2><button class="link-button" @click="openSection('Nhật ký hoạt động')">Tất cả <ArrowRight :size="15"/></button></div><div class="activity-list"><div v-for="(event,index) in activity.slice(0,4)" :key="index" class="activity-row"><span class="event-icon" :class="event.kind"><CheckCircle2 :size="18"/></span><div><b>{{ event.title }}</b><small>{{ event.detail }}</small></div><time>{{ event.time }}</time></div></div></article>
          </section>
          <section class="surface quick-users"><div class="surface-title"><div><h2>Người dùng gần đây</h2><p>Danh sách tài khoản trong workspace</p></div><button class="link-button" @click="openSection('Người dùng')">Xem tất cả <ArrowRight :size="15"/></button></div><div class="mini-table"><div v-for="u in users.slice(0,3)" :key="u.email" class="mini-user"><span class="avatar" :class="u.color">{{ u.initials }}</span><span><b>{{ u.name }}</b><small>{{ u.email }}</small></span><span class="role-pill">{{ u.role }}</span><span class="status-pill"><i></i>{{ u.status }}</span><MoreHorizontal :size="19"/></div></div></section>
        </template>

        <template v-else-if="activeNav==='Người dùng'">
          <section class="page-heading"><div><p class="eyebrow">THÀNH VIÊN WORKSPACE</p><h1>Người dùng<span>.</span></h1><p>Quản lý tài khoản và quyền truy cập của đội ngũ.</p></div><button class="primary-button add-button" @click="showUserModal=true"><Plus :size="18"/> Thêm người dùng</button></section>
          <section class="surface user-toolbar"><div class="toolbar-search"><Search :size="18"/><input v-model="searchText" placeholder="Tìm theo tên, email hoặc vai trò..."/></div><button class="secondary-button" @click="notify('Bộ lọc tài khoản')"><SlidersHorizontal :size="17"/> Bộ lọc <ArrowDown :size="14"/></button></section>
          <section class="surface users-table"><div class="table-header"><span>NGƯỜI DÙNG</span><span>VAI TRÒ</span><span>TRẠNG THÁI</span><span>ĐĂNG NHẬP GẦN NHẤT</span><span></span></div><div v-for="u in filteredUsers" :key="u.email" class="user-table-row"><div class="table-person"><span class="avatar" :class="u.color">{{ u.initials }}</span><span><b>{{ u.name }}</b><small>{{ u.email }}</small></span></div><span class="role-pill">{{ u.role }}</span><span class="status-pill"><i></i>{{ u.status }}</span><span class="last-login"><Clock3 :size="15"/>{{ u.last }}</span><button class="icon-button row-more" aria-label="Tùy chọn" @click="notify('Tùy chọn người dùng')"><MoreHorizontal :size="20"/></button></div><div v-if="!filteredUsers.length" class="empty-state"><Users :size="28"/><b>Không tìm thấy người dùng</b><span>Thử thay đổi từ khóa tìm kiếm.</span></div><div class="table-footer">Hiển thị {{ filteredUsers.length }} trên {{ users.length }} người dùng <span>1–{{ filteredUsers.length }} trong {{ users.length }} <button class="icon-button" aria-label="Trang trước"><ArrowLeft :size="16"/></button><button class="icon-button" aria-label="Trang sau"><ArrowRight :size="16"/></button></span></div></section>
        </template>

        <template v-else-if="activeNav==='Vai trò & phân quyền'">
          <section class="page-heading"><div><p class="eyebrow">KIỂM SOÁT TRUY CẬP</p><h1>Vai trò & phân quyền<span>.</span></h1><p>Thiết lập quyền phù hợp cho từng thành viên trong workspace.</p></div><button class="primary-button add-button" @click="notify('Tạo vai trò mới sẽ khả dụng khi kết nối backend.')"><Plus :size="18"/> Tạo vai trò</button></section>
          <section class="role-grid"><article v-for="role in [{name:'Quản trị viên',desc:'Toàn quyền quản lý workspace và tài khoản.',users:1,icon:ShieldCheck,color:'violet',perms:['Quản lý người dùng','Quản lý vai trò','Xem nhật ký']},{name:'Quản lý',desc:'Quản lý người dùng và theo dõi hoạt động.',users:0,icon:UserCog,color:'blue',perms:['Quản lý người dùng','Xem nhật ký']},{name:'Thành viên',desc:'Truy cập các tính năng được cấp quyền.',users:Math.max(users.length-1,0),icon:User,color:'mint',perms:['Xem thông tin cá nhân']}]" :key="role.name" class="surface role-card"><div class="role-card-head"><span class="role-icon" :class="role.color"><component :is="role.icon" :size="23"/></span><button class="icon-button" @click="notify('Tùy chọn vai trò')"><MoreHorizontal :size="20"/></button></div><h2>{{ role.name }}</h2><p>{{ role.desc }}</p><div class="role-count"><Users :size="16"/> {{ role.users }} người dùng</div><div class="permissions"><span v-for="perm in role.perms" :key="perm"><Check :size="14"/>{{ perm }}</span></div><button class="role-edit" @click="notify('Chỉnh sửa quyền sẽ khả dụng khi kết nối backend.')">Xem quyền <ArrowRight :size="15"/></button></article></section>
        </template>

        <template v-else-if="activeNav==='Nhật ký hoạt động'">
          <section class="page-heading"><div><p class="eyebrow">THEO DÕI WORKSPACE</p><h1>Nhật ký hoạt động<span>.</span></h1><p>Lịch sử đăng nhập và thay đổi trong không gian làm việc.</p></div><button class="secondary-button" @click="refresh"><RefreshCw :size="17"/> Làm mới</button></section>
          <section class="surface user-toolbar"><div class="toolbar-search"><Search :size="18"/><input v-model="searchText" placeholder="Tìm trong nhật ký..."/></div><button class="secondary-button" @click="notify('Bộ lọc hoạt động')"><SlidersHorizontal :size="17"/> Bộ lọc</button></section>
          <section class="surface log-list"><div v-for="(event,index) in activity.filter(e=>`${e.title} ${e.detail}`.toLowerCase().includes(searchText.toLowerCase()))" :key="index" class="log-row"><span class="event-icon" :class="event.kind"><CheckCircle2 :size="18"/></span><div><b>{{ event.title }}</b><small>{{ event.detail }}</small></div><span class="log-type">Xác thực</span><time>{{ event.time }}</time></div></section>
        </template>
        <template v-else>
          <section class="page-heading"><div><p class="eyebrow">HỖ TRỢ TRUY CẬP</p><h1>Cấp lại mật khẩu<span>.</span></h1><p>Gửi liên kết khôi phục mật khẩu đến email của người dùng.</p></div></section><section class="surface reset-card"><span class="reset-icon"><KeyRound :size="25"/></span><h2>Gửi liên kết đặt lại mật khẩu</h2><p>Người dùng sẽ nhận được email bảo mật để thiết lập mật khẩu mới.</p><label>Email tài khoản</label><div class="toolbar-search"><Search :size="18"/><input v-model="loginId" placeholder="name@company.vn"/></div><button class="primary-button" @click="resetPassword">Gửi liên kết <ArrowRight :size="17"/></button></section>
        </template>
      </div>
    </section>
    <div v-if="menuOpen" class="mobile-backdrop" @click="menuOpen=false"></div>
    <div v-if="showUserModal" class="modal-backdrop" @click.self="showUserModal=false"><section class="modal-card"><button class="icon-button modal-close" @click="showUserModal=false"><X :size="20"/></button><span class="modal-icon"><User :size="22"/></span><p class="eyebrow">WORKSPACE</p><h2>Thêm người dùng</h2><p>Thêm một thành viên vào danh sách workspace.</p><label>Email người dùng</label><div class="input-wrap"><User :size="18"/><input placeholder="name@company.vn"/></div><label>Vai trò</label><div class="input-wrap"><Shield :size="18"/><select><option>Thành viên</option><option>Quản lý</option><option>Quản trị viên</option></select><ChevronDown :size="16"/></div><button class="primary-button modal-submit" @click="addUser">Thêm người dùng <ArrowRight :size="17"/></button></section></div>
    <div v-if="toast" class="toast"><CheckCircle2 :size="18"/>{{ toast }}</div>
  </main>
</template>
