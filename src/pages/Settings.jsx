import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Camera, Save, User, Mail, Lock, Phone, Globe, Bell, Shield, Eye, EyeOff } from "lucide-react";

export default function Settings() {
  const { admin, updateAdmin } = useAuth();
  const [profile, setProfile] = useState({ name:admin?.name||"", email:admin?.email||"", phone:"+1 555-0001", avatar:admin?.avatar||"" });
  const [passwords, setPasswords] = useState({ current:"", newPw:"", confirm:"" });
  const [platform, setPlatform] = useState({ platformName:"SkillShare", supportEmail:"support@skillshare.com", supportPhone:"+1 800-SKILL", commission:15, maintenance:false });
  const [notifications, setNotifications] = useState({ emailAlerts:true, newUser:true, newBooking:true, complaint:true, weeklyReport:false });
  const [showPw, setShowPw] = useState(false);
  const [saved, setSaved] = useState("");

  const handleSave = (section) => {
    if (section==="profile") updateAdmin(profile);
    setSaved(section);
    setTimeout(()=>setSaved(""),2500);
  };

  const setP = (k,v) => setProfile(p=>({...p,[k]:v}));
  const setPw = (k,v) => setPasswords(p=>({...p,[k]:v}));
  const setPL = (k,v) => setPlatform(p=>({...p,[k]:v}));
  const setN = (k,v) => setNotifications(p=>({...p,[k]:v}));

  const SaveBtn = ({section}) => (
    <button onClick={()=>handleSave(section)} className="btn-primary flex items-center gap-2">
      <Save size={15}/> {saved===section ? "✓ Saved!" : "Save Changes"}
    </button>
  );

  return (
    <div className="max-w-3xl space-y-6">
      {/* Admin Profile */}
      <div className="card">
        <h2 className="font-bold text-gray-800 text-lg mb-5 flex items-center gap-2"><User size={18} className="text-primary"/>Admin Profile</h2>
        <div className="flex items-center gap-5 mb-6 pb-5 border-b border-gray-100">
          <div className="relative flex-shrink-0">
            <img src={profile.avatar||admin?.avatar} alt="Admin" className="w-20 h-20 rounded-2xl object-cover ring-2 ring-primary/20"/>
            <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-primary rounded-full flex items-center justify-center shadow-md hover:bg-primary-700">
              <Camera size={14} className="text-white"/>
            </button>
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">{admin?.name}</h3>
            <p className="text-sm text-primary font-medium mt-0.5">Super Administrator</p>
            <p className="text-xs text-gray-400 mt-1">JPG, PNG or GIF — max 5MB</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
          {[{k:"name",label:"Full Name",icon:User,type:"text"},{k:"email",label:"Email",icon:Mail,type:"email"},{k:"phone",label:"Phone",icon:Phone,type:"tel"}].map(({k,label,icon:Icon,type})=>(
            <div key={k}>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">{label}</label>
              <div className="relative"><Icon size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"/>
                <input type={type} value={profile[k]} onChange={e=>setP(k,e.target.value)} className="input pl-10"/>
              </div>
            </div>
          ))}
        </div>
        <SaveBtn section="profile"/>
      </div>

      {/* Change Password */}
      <div className="card">
        <h2 className="font-bold text-gray-800 text-lg mb-5 flex items-center gap-2"><Lock size={18} className="text-primary"/>Change Password</h2>
        <div className="space-y-4 mb-5">
          {[{k:"current",label:"Current Password"},{k:"newPw",label:"New Password"},{k:"confirm",label:"Confirm New Password"}].map(({k,label})=>(
            <div key={k}>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">{label}</label>
              <div className="relative"><Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"/>
                <input type={showPw?"text":"password"} value={passwords[k]} onChange={e=>setPw(k,e.target.value)} placeholder="••••••••" className="input pl-10 pr-10"/>
                {k==="newPw" && <button type="button" onClick={()=>setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">{showPw?<EyeOff size={15}/>:<Eye size={15}/>}</button>}
              </div>
            </div>
          ))}
        </div>
        <SaveBtn section="password"/>
      </div>

      {/* Platform Settings */}
      <div className="card">
        <h2 className="font-bold text-gray-800 text-lg mb-5 flex items-center gap-2"><Globe size={18} className="text-primary"/>Platform Settings</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
          {[{k:"platformName",label:"Platform Name"},{k:"supportEmail",label:"Support Email"},{k:"supportPhone",label:"Support Phone"}].map(({k,label})=>(
            <div key={k}>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">{label}</label>
              <input value={platform[k]} onChange={e=>setPL(k,e.target.value)} className="input"/>
            </div>
          ))}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Commission %</label>
            <div className="relative">
              <input type="number" value={platform.commission} onChange={e=>setPL("commission",Number(e.target.value))} min={0} max={50} className="input pr-8"/>
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-semibold">%</span>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between p-4 bg-amber-50 border border-amber-200 rounded-xl mb-5">
          <div>
            <p className="font-semibold text-gray-800">Maintenance Mode</p>
            <p className="text-xs text-gray-500 mt-0.5">When enabled, only admins can access the platform</p>
          </div>
          <button onClick={()=>setPL("maintenance",!platform.maintenance)} className={`relative w-12 h-6 rounded-full transition-colors ${platform.maintenance?"bg-amber-500":"bg-gray-200"}`}>
            <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${platform.maintenance?"left-6":"left-0.5"}`}/>
          </button>
        </div>
        <SaveBtn section="platform"/>
      </div>

      {/* Notification Settings */}
      <div className="card">
        <h2 className="font-bold text-gray-800 text-lg mb-5 flex items-center gap-2"><Bell size={18} className="text-primary"/>Notification Preferences</h2>
        <div className="space-y-3 mb-5">
          {[{k:"emailAlerts",label:"Email Alerts",desc:"Receive all alerts via email"},{k:"newUser",label:"New User Registered",desc:"When a new user signs up"},{k:"newBooking",label:"New Booking",desc:"When a new booking is created"},{k:"complaint",label:"New Complaint Filed",desc:"When a report is submitted"},{k:"weeklyReport",label:"Weekly Report",desc:"Weekly platform summary email"}].map(({k,label,desc})=>(
            <div key={k} className="flex items-center justify-between p-3.5 bg-gray-50 rounded-xl">
              <div><p className="text-sm font-semibold text-gray-800">{label}</p><p className="text-xs text-gray-400">{desc}</p></div>
              <button onClick={()=>setN(k,!notifications[k])} className={`relative w-11 h-6 rounded-full transition-colors ${notifications[k]?"bg-primary":"bg-gray-200"}`}>
                <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${notifications[k]?"left-5":"left-0.5"}`}/>
              </button>
            </div>
          ))}
        </div>
        <SaveBtn section="notifications"/>
      </div>

      {/* Security */}
      <div className="card border-red-100 bg-red-50/30">
        <h2 className="font-bold text-gray-800 text-lg mb-4 flex items-center gap-2"><Shield size={18} className="text-red-500"/>Security & Danger Zone</h2>
        <div className="space-y-3">
          {[{label:"Export Platform Data",desc:"Download all platform data as CSV",btnLabel:"Export",variant:"outline"},
            {label:"Clear All Cache",desc:"Clear platform cache and temporary files",btnLabel:"Clear Cache",variant:"outline"},
            {label:"Reset Platform Settings",desc:"Reset all settings to factory defaults",btnLabel:"Reset Settings",variant:"danger"}].map(({label,desc,btnLabel,variant})=>(
            <div key={label} className="flex items-center justify-between p-4 bg-white rounded-xl border border-red-100">
              <div><p className="text-sm font-semibold text-gray-800">{label}</p><p className="text-xs text-gray-400">{desc}</p></div>
              <button className={variant==="danger"?"btn-danger":"btn-outline"} onClick={()=>alert(`${btnLabel} — would connect to API in production`)}>{btnLabel}</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
