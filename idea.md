# Smart Campus Resource Booking System

## Problem Statement
Colleges often face issues such as:
- Double booking of classrooms/cabins and labs
- Manual approval processes
- Lack of real-time availability tracking
- No centralized audit system

This project aims to build a centralized web-based system to manage campus resources efficiently.

---

## Scope

The system allows:
- Students and Faculty to book resources
- Admins to manage and approve bookings
- Real-time availability checking
- Notification system for booking updates

---

## Key Features

- Role-Based Access Control (Student, Faculty, Admin)
- Resource availability calendar
- Conflict detection
- Approval workflow
- Booking status lifecycle
- Notification system
- Audit logs

---

## Tech Stack

- Frontend: React
- Backend: Node.js + Express
- Database: MongoDB
- Authentication: JWT
- Architecture: Controller-Service-Repository pattern

---

## OOP Principles Used

- Encapsulation: Booking rules inside BookingService
- Abstraction: NotificationService interface
- Inheritance: User → Student / Faculty / Admin
- Polymorphism: Approval logic based on user role

---

## Design Patterns Used

- Strategy Pattern (Approval strategies)
- Observer Pattern (Booking status notifications)
- Factory Pattern (Resource creation)
