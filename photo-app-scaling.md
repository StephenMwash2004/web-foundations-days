# SnapShare Scaling Plan

## 1. Assumptions

Given:

- Registered users: **10,000,000**
- Daily active users (10%): **1,000,000**
- Each active user uploads **1 photo/day**
- Each active user views **50 feed pages/day**
- Average photo size: **2 MB**
- Thumbnail size: **50 KB**
- 1 day = 86,400 seconds
- 365 days in a year

---

## 2. Estimated Traffic

### Uploads per second

Daily uploads:

1,000,000 users × 1 photo = **1,000,000 uploads/day**

Uploads per second:

1,000,000 ÷ 86,400 ≈ **11.6 uploads/second**

**Estimated uploads per second: ~12 uploads/sec**

---

### Feed views per second

Daily feed views:

1,000,000 users × 50 pages = **50,000,000 feed views/day**

Feed views per second:

50,000,000 ÷ 86,400 ≈ **579 feed views/second**

**Estimated feed views per second: ~580 views/sec**

---

### Storage per year

#### Photos

1,000,000 photos/day × 365 = **365,000,000 photos/year**

365,000,000 × 2 MB

= **730,000,000 MB**

≈ **730 TB**

#### Thumbnails

365,000,000 × 50 KB

= **18,250,000,000 KB**

≈ **18.25 TB**

#### Total storage

730 TB + 18.25 TB

≈ **748 TB per year**

---

## 3. Is the System Read-Heavy or Write-Heavy?

SnapShare is a **read-heavy system**.

Although users upload only **1 photo per day**, they view **50 feed pages per day**. Feed requests happen much more frequently than uploads, so the system performs many more reads than writes.

---

# 4. Architecture Diagram

```text
                    Users
                      |
                      |
                +-------------+
                |     CDN     |
                +-------------+
                      |
                      |
              +----------------+
              | Load Balancer  |
              +----------------+
                      |
      -----------------------------------
      |               |                 |
+------------+  +------------+  +------------+
| App Server |  | App Server |  | App Server |
+------------+  +------------+  +------------+
      |               |                |
      ----------------|----------------
                      |
                 +-----------+
                 |   Cache   |
                 +-----------+
                      |
               +---------------+
               | Primary DB    |
               +---------------+
                      |
               +---------------+
               | Read Replica  |
               +---------------+
                      |
               +---------------+
               | Object Storage|
               | (Photos)      |
               +---------------+
                      |
                 +-----------+
                 |  Queue    |
                 +-----------+
                      |
                 +-----------+
                 |  Worker   |
                 +-----------+
                      |
            Creates Photo Thumbnails
```

---

# 5. Components and the Problems They Solve

### CDN

Stores copies of popular images close to users so photos load faster and reduce traffic to the main servers.

### Load Balancer

Distributes incoming requests across multiple application servers to prevent one server from becoming overloaded.

### App Servers

Handle user logins, uploads, feed generation, and all business logic.

### Cache

Stores frequently requested feed data so the database does not have to process every request.

### Primary Database

Stores user accounts, followers, posts, comments, and other application data.

### Read Replica

Handles read requests such as feed loading, reducing the workload on the primary database.

### Object Storage

Stores the original photo files because images are large and should not be kept inside the database.

### Queue

Temporarily stores thumbnail creation jobs so uploads finish quickly without waiting for image processing.

### Worker

Processes queued jobs and creates thumbnails in the background.

---

# 6. Step-by-Step Flow of Uploading a Photo

1. The user uploads a photo from the mobile app or website.
2. The request passes through the Load Balancer.
3. An App Server receives the upload request.
4. The original photo is stored in Object Storage.
5. The photo information (owner, caption, location, storage path, upload time) is saved in the Primary Database.
6. The App Server sends a thumbnail creation job to the Queue.
7. The upload is confirmed to the user immediately.
8. A Worker reads the job from the Queue.
9. The Worker creates a thumbnail.
10. The thumbnail is saved back to Object Storage.
11. When other users open their feeds, the CDN serves the images quickly while feed information is retrieved from the Cache or Read Replica.

---

# 7. Trade-offs

### Trade-off 1: Cache

**Advantage:**
- Faster feed loading and fewer database queries.

**Disadvantage:**
- Cached data may become temporarily outdated before it is refreshed.

---

### Trade-off 2: Read Replica

**Advantage:**
- Reduces load on the primary database and improves read performance.

**Disadvantage:**
- Data replication takes a small amount of time, so users may briefly see older data.

---

### Trade-off 3: Queue and Worker

**Advantage:**
- Uploads complete quickly because thumbnail generation happens in the background.

**Disadvantage:**
- Thumbnails are not available immediately after upload if the queue becomes busy.

## 2.5 Peak-Traffic Safety Margins

The calculations above represent the **average** traffic over an entire day. In reality, user activity is not evenly distributed. More people use social media during mornings, lunch breaks, evenings, weekends, and special events, creating traffic spikes.

To ensure SnapShare remains fast during these busy periods, the system should be designed with a safety margin of about **3× the average load**.

| Metric | Average | 3× Peak Capacity |
|--------|---------:|-----------------:|
| Uploads per second | ~12 uploads/sec | **~36 uploads/sec** |
| Feed views per second | ~580 views/sec | **~1,740 views/sec** |

Designing for peak traffic provides several benefits:

- Prevents server overload during busy hours.
- Gives room for future user growth without immediate upgrades.
- Improves reliability during viral posts or special events.
- Helps maintain fast response times even when many users are online simultaneously.

This extra capacity does not mean the system always runs at peak usage. Instead, it ensures the application can continue operating smoothly when traffic temporarily increases above the daily average.