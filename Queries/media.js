// 1. تمام ویدیوها با اطلاعات سایز و مدت زمان
db.media.find(
    { media_type: "video" },
    { file_url: 1, file_size: 1, duration: 1 }
  );
  
  // 2. میانگین سایز فایل‌ها بر اساس نوع فایل
  db.media.aggregate([
    { $group: { _id: "$file_type", avg_size: { $avg: "$file_size" } } }
  ]);
  
  // 3. فایل‌های بارگذاری‌شده توسط یک کاربر خاص
  db.media.find({ uploaded_by: ObjectId("USER_ID_HERE") });  