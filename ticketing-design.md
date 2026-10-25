# TicketHub System Design

## 1. Requirements

### Functional Requirements

- Users can create accounts and log in.
- Users can browse available concerts and events.
- Users can view event details including date, location and price.
- Users can view available seats.
- Users can temporarily hold seats before payment.
- Users can pay and confirm ticket purchases.
- Users can view purchased tickets.
- Event organizers can create and manage events.
- The system prevents two users from purchasing the same seat.

---

### Non-Functional Requirements

## Speed

- Event pages should load within a few seconds.
- Seat availability should update quickly during ticket sales.
- The system should handle thousands of users buying tickets simultaneously.

## Correctness

- A seat must never be sold twice.
- Payments must only create tickets after successful payment.
- Failed payments should release held seats.

## Fairness

- Users should have equal opportunity during popular sales.
- The system should prevent users from bypassing others unfairly.
- Requests should be processed in an orderly way.

## Availability

- The service should remain available during popular concert releases.
- Failure of one server should not stop the system.

## Scalability

- The system should support millions of users and sudden traffic spikes.

---

# 2. Traffic Estimates


## Normal Day

Given:

- Registered users = 2 million
- Daily visitors = 50,000
- Each visitor views 10 pages
- Tickets sold = 5,000/day


### Page Views

50,000 × 10

= 500,000 page views/day


Requests per second:

500,000 / 86,400

≈ 6 requests/sec


### Ticket Purchases

5,000 / 86,400

≈ 0.06 writes/sec


---

# Big Sale Traffic

Given:

- 200,000 people
- 20,000 seats
- 10 minutes


Purchase attempts:

200,000 / 600 seconds

≈ 333 users/sec


With a safety margin:

333 × 3

≈ 1,000 requests/sec


## Comparison

| Traffic | Normal Day | Big Sale |
|-|-|-|
| Users | 50,000 visitors | 200,000 buyers |
| Requests | ~6/sec | ~333/sec |
| Writes | 0.06/sec | Hundreds/sec |
| Main challenge | Normal browsing | Seat competition |


---

# 3. API Design


| Method | Endpoint | Purpose | Status |
|-|-|-|-|
| GET | /events | Browse events | 200 |
| GET | /events/{id} | View event details | 200 |
| GET | /events/{id}/seats | View seats | 200 |
| POST | /seats/{id}/hold | Temporarily hold seat | 201 |
| POST | /orders | Create payment order | 201 |
| POST | /payments | Complete payment | 200 |
| GET | /tickets | View user tickets | 200 |


---

## Hold Seat Example

POST /seats/500/hold


Request:

```json
{
  "userId": 10,
  "eventId": 20
}
```

Response:

```json
{
  "seatId": 500,
  "status": "HELD",
  "expires": "2026-11-01T10:10:00"
}
```

4. Database Design
Users
Column	Type
id	INT PRIMARY KEY
name	VARCHAR
email	VARCHAR UNIQUE
password	VARCHAR


Events
Column	Type
id	INT PRIMARY KEY
title	VARCHAR
venue	VARCHAR
date	DATE


Seats
Column	Type
id	INT PRIMARY KEY
event_id	INT FOREIGN KEY
seat_number	VARCHAR
status	VARCHAR


Orders
Column	Type
id	INT PRIMARY KEY
user_id	INT FOREIGN KEY
seat_id	INT FOREIGN KEY
payment_status	VARCHAR
created_at	DATE


Relationships
One user can have many orders:
User
 |
 |
Many Orders

One event has many seats:
Event
 |
 |
Many Seats

One seat belongs to one order after purchase:
Seat ---- Order

5. Preventing Double Booking
TicketHub prevents double booking using database transactions and constraints.

When buying a ticket:
1. Start a database transaction.
2. Lock the selected seat row.
3. Check the seat status.
4. If available, change status to HELD.
5. Process payment.
6. Change status to SOLD.
7. Commit transaction.
If another user tries to buy the same seat:
- The database lock prevents both transactions from modifying the same seat.
- Only one transaction succeeds.
A database constraint also prevents duplicate tickets:
UNIQUE(event_id, seat_id)

This guarantees that one seat cannot have two orders.
6. Architecture
                  ```text
                 Users
                   |
                  DNS
                   |
                  CDN
                   |
            Load Balancer
              /        \
        App Server   App Server
              \        /
               Cache
                 |
          Ticket Service
                 |
       -------------------
       |                 |
Primary Database   Read Replica
       |
     Queue
       |
    Workers
       |
Payment / Email Services
```

Components
DNS
Finds the correct TicketHub servers.
CDN
Caches static files and reduces server load.
Load Balancer
Distributes traffic across servers.
App Servers
Handle user requests and business logic.
Cache
Stores frequently accessed event information.
Primary Database
Handles seat reservations and ticket purchases.
Read Replica
Handles browsing requests without affecting purchases.
Queue
Queue handles slow background tasks such as emails and payment notifications, preventing these tasks from slowing down ticket purchases during high traffic.
Workers
Process emails and notifications.
Handling Big Sale Traffic
During popular sales:
- More app servers can be added horizontally.
- CDN reduces repeated content requests.
- Cache reduces database reads.
- Queue handles background tasks.
- Database transactions protect seat correctness.
7. Trade-offs
Database Locking vs Speed
Locking seats prevents double booking but may slow purchases during extreme demand.

Solution:
Use short locks and temporary reservations.
Cache vs Accuracy
Caching improves speed but seat availability changes quickly.

Solution:
Cache event information but always check seats from the database before purchase.
More Servers vs Cost
Adding servers improves performance but increases infrastructure costs.

# Conclusion

TicketHub is designed to handle normal traffic efficiently while scaling during popular concert sales. The combination of load balancing, caching, database transactions, and queues allows the system to remain fast, fair, and reliable.