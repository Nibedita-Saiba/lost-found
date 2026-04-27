# Campus Lost & Found Portal

A modern, feature-rich web application for managing lost and found items across a college campus. This portal enables students to report lost items, browse found items, claim ownership, and provides administrators with tools to verify and approve claims.

## 📋 Table of Contents

- [Features](#features)
- [Getting Started](#getting-started)
- [Authentication System](#authentication-system)
- [Usage Guide](#usage-guide)
- [Project Structure](#project-structure)
- [Technologies Used](#technologies-used)
- [Key Functions](#key-functions)
- [Browser Support](#browser-support)
- [Data Storage](#data-storage)
- [Tips & Best Practices](#tips--best-practices)

## ✨ Features

### 🔐 **User Authentication**
- User registration with email validation and duplicate prevention
- Secure login system with password verification
- Session persistence using localStorage
- Logout functionality with confirmation dialog
- User greeting display after login

### 📊 **Dashboard**
- Real-time statistics showing:
  - Total items in system
  - Lost reports count
  - Found reports count
  - Claimed items
  - Approved claims
  - Returned items
- Recent notifications feed (shows latest 8 updates)

### 📝 **Report Items**
- Submit lost or found items with:
  - Item name and category
  - Location details
  - Date picker
  - Image upload with preview
  - Detailed description
- Edit existing item records
- Delete item records with confirmation
- Automatic status tracking

### 🔍 **Search & Filter**
- Full-text search by item name, category, or location
- Filter by type: Lost, Found
- Filter by status: Pending, Claimed, Approved, Returned, Rejected
- Real-time filtering as you type

### 🏷️ **Item Listings**
- Visual card-based layout for all items
- Display item images with fallback placeholder
- Show item type and current status with color-coded badges
- Quick action buttons for claiming and managing items
- Empty state message when no items match search

### 📋 **Claim Management**
- Students can claim found items or report lost items
- Modal form for submitting claims with:
  - Claimant name and contact info
  - Proof of ownership description
  - Email and phone number
- Items transition to "Claimed" status upon submission

### ✅ **Admin Panel**
- Review all pending claims
- Approve or reject claims with single click
- Mark items as returned
- View claimant information and proof details
- Admin-only access to verification workflow

### 🎨 **Theme Support**
- Light mode (default)
- Dark mode toggle
- Persistent theme preference using localStorage
- Smooth transitions between themes

### 💾 **Data Export**
- Export all item records as JSON file
- One-click download for external analysis
- Includes all item and claim information

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- No backend server required (uses localStorage)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Avi-reck/campus-lost-found.git
   cd campus-lost-found
