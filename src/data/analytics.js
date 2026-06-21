export const revenueData = [
  { month:"Jan", revenue:12400, bookings:84, target:10000 },
  { month:"Feb", revenue:15800, bookings:108, target:13000 },
  { month:"Mar", revenue:18200, bookings:124, target:15000 },
  { month:"Apr", revenue:16900, bookings:115, target:16000 },
  { month:"May", revenue:21300, bookings:145, target:18000 },
  { month:"Jun", revenue:24700, bookings:168, target:20000 },
  { month:"Jul", revenue:22100, bookings:150, target:22000 },
  { month:"Aug", revenue:28400, bookings:193, target:24000 },
  { month:"Sep", revenue:31200, bookings:212, target:26000 },
  { month:"Oct", revenue:29800, bookings:203, target:28000 },
  { month:"Nov", revenue:35600, bookings:242, target:30000 },
  { month:"Dec", revenue:38900, bookings:264, target:35000 },
];

export const userGrowthData = [
  { month:"Jan", seekers:120, providers:45 },
  { month:"Feb", seekers:185, providers:62 },
  { month:"Mar", seekers:240, providers:78 },
  { month:"Apr", seekers:310, providers:95 },
  { month:"May", seekers:398, providers:118 },
  { month:"Jun", seekers:490, providers:142 },
  { month:"Jul", seekers:578, providers:163 },
  { month:"Aug", seekers:680, providers:189 },
  { month:"Sep", seekers:790, providers:214 },
  { month:"Oct", seekers:920, providers:248 },
  { month:"Nov", seekers:1080, providers:286 },
  { month:"Dec", seekers:1240, providers:324 },
];

export const bookingStatusData = [
  { name:"Completed", value:1840, color:"#22c55e" },
  { name:"Ongoing", value:320, color:"#3b82f6" },
  { name:"Pending", value:180, color:"#f59e0b" },
  { name:"Cancelled", value:96, color:"#ef4444" },
];

export const skillsData = [
  { skill:"Web Dev", bookings:680 },
  { skill:"UI/UX", bookings:540 },
  { skill:"Mobile", bookings:420 },
  { skill:"Graphic", bookings:380 },
  { skill:"Content", bookings:310 },
  { skill:"Marketing", bookings:260 },
  { skill:"Video", bookings:190 },
  { skill:"Data Sci", bookings:140 },
];

export const topProviders = [
  { name:"Alex Morgan", skill:"Web Dev", earnings:8240, bookings:94, rating:4.9 },
  { name:"Elena Vasquez", skill:"Graphic Design", earnings:9800, bookings:210, rating:4.9 },
  { name:"Priya Sharma", skill:"UI/UX", earnings:6100, bookings:78, rating:4.8 },
  { name:"Sarah Chen", skill:"Marketing", earnings:5600, bookings:63, rating:4.8 },
  { name:"Marcus Johnson", skill:"Mobile Dev", earnings:4900, bookings:52, rating:4.7 },
];

export const recentActivity = [
  { id:1, type:"new_user", message:"Jordan Lee joined as a Skill Seeker", time:"2 min ago", icon:"user" },
  { id:2, type:"new_booking", message:"New booking #BK011 created — Web Development", time:"8 min ago", icon:"calendar" },
  { id:3, type:"new_provider", message:"Ryan Torres submitted for provider verification", time:"15 min ago", icon:"briefcase" },
  { id:4, type:"complaint", message:"New complaint filed against Marcus Johnson", time:"32 min ago", icon:"alert" },
  { id:5, type:"completed", message:"Booking #BK006 marked as completed", time:"1 hour ago", icon:"check" },
  { id:6, type:"review", message:"5-star review left for Alex Morgan", time:"2 hours ago", icon:"star" },
  { id:7, type:"new_user", message:"Priya Nair joined as a Skill Seeker", time:"3 hours ago", icon:"user" },
  { id:8, type:"new_provider", message:"Mia Anderson verified as Skill Provider", time:"5 hours ago", icon:"check" },
];
