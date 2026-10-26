
/*
 * ============================================================
 * ANCIENT SIGNAL PORTFOLIO
 * File: js/projects.js
 * Purpose: Central data source for all portfolio projects.
 * ============================================================
 *
 * HOW TO ADD A PROJECT:
 * 1. Copy one project object.
 * 2. Give it a unique id.
 * 3. Update its information, technologies and features.
 * 4. Add the object to PORTFOLIO_PROJECTS.
 *
 * Keep this file as a classic JavaScript script.
 * Do not add "export" or "import".
 *
 * IMAGE PATHS:
 * Use paths relative to index.html, for example:
 * assets/images/projects/studentxtutor/cover.webp
 *
 * LINKS:
 * Use an empty string when a repository or live demo
 * is not available. Do not use "#" as a placeholder.
 */

"use strict";

window.PORTFOLIO_PROJECTS = [

    // ========================================================
    // 01. STUDENTXTUTOR
    // ========================================================
    {
        id: "studentxtutor",

        title: "StudentXTutor Session Booking",

        subtitle: "Peer Tutoring & Session Management",

        category: "web",

        status: "Academic Project",

        featured: true,

        summary:
            "A web platform that helps students find tutors, arrange tutoring sessions, and manage their learning support.",

        purpose:
            "To streamline the process of arranging peer tutoring by providing a central place for session scheduling and feedback.",

        description:
            "StudentXTutor is a tutoring platform developed to support students and tutors with session coordination. It focuses on tutor availability, booking management, and feedback after tutoring sessions.",

        technologies: [
            "Python",
            "Flask",
            "Supabase",
            "PostgreSQL",
            "HTML5",
            "CSS3",
            "JavaScript",
            "Jinja2"
        ],

        features: [
            "Student and tutor account workflows",
            "Tutor session availability",
            "Tutoring session booking",
            "Session management",
            "Email reminders",
            "Tutor ratings and feedback"
        ],

        challenges: [],

        lessonsLearned: [],

        coverImage: "",

        galleryImages: [
            // Add screenshot paths here when available.
            // Example:
            // "assets/images/projects/studentxtutor/dashboard.webp"
        ],

        githubUrl: "",

        liveUrl: "",

        year: "",

        role: "Developer"
    },


    // ========================================================
    // 02. SHOPPERS MART EMPLOYEE MANAGEMENT
    // ========================================================
    {
        id: "shoppers-mart-employee",

        title: "Shoppers Mart Employee Management",

        subtitle: "Recruitment & Employee Administration",

        category: "business",

        status: "Academic Project",

        featured: true,

        summary:
            "A web-based employee management system supporting recruitment, onboarding, and employee tracking.",

        purpose:
            "To help organise recruitment activities and employee information within a business environment.",

        description:
            "This Shoppers Mart system focuses on employee-related processes, including recruitment, onboarding, and maintaining employee records. It is one of the business systems developed around the Shoppers Mart furniture business scenario.",

        technologies: [
            "ASP.NET Core MVC",
            "C#",
            "Azure SQL",
            "Entity Framework",
            "Razor Views"
        ],

        features: [
            "Recruitment workflow support",
            "Employee onboarding",
            "Employee information management",
            "Employee tracking"
        ],

        challenges: [],

        lessonsLearned: [],

        coverImage: "",

        galleryImages: [],

        githubUrl: "",

        liveUrl: "",

        year: "",

        role: "Developer"
    },


    // ========================================================
    // 03. SHOPPERS MART CUSTOM MANUFACTURING
    // ========================================================
    {
        id: "shoppers-mart-manufacturing",

        title: "Shoppers Mart Custom Manufacturing",

        subtitle: "Furniture Quotes & Manufacturing Workflow",

        category: "business",

        status: "Academic Project",

        featured: true,

        summary:
            "A business system for tracking custom furniture quotations, manufacturing processes, and material usage.",

        purpose:
            "To organise custom furniture orders and provide visibility into the manufacturing workflow and materials used.",

        description:
            "This system focuses on the custom furniture side of Shoppers Mart. It supports the management of furniture quotations, manufacturing activities, and material usage as part of the business process.",

        technologies: [
            "ASP.NET Core MVC",
            "C#",
            "Azure SQL",
            "Entity Framework",
            "Razor Views"
        ],

        features: [
            "Custom furniture quotation tracking",
            "Manufacturing process management",
            "Material usage tracking",
            "Business workflow organisation"
        ],

        challenges: [],

        lessonsLearned: [],

        coverImage: "",

        galleryImages: [],

        githubUrl: "",

        liveUrl: "",

        year: "",

        role: "Developer"
    },


    // ========================================================
    // 04. SHOPPERS MART ONLINE STORE
    // ========================================================
    {
        id: "shoppers-mart-store",

        title: "Shoppers Mart Online Store",

        subtitle: "Furniture E-commerce & Order Management",

        category: "web",

        status: "Academic Project",

        featured: true,

        summary:
            "An e-commerce platform for presenting products and supporting shopping cart and order management workflows.",

        purpose:
            "To provide customers with an online shopping experience while supporting product discovery and order administration.",

        description:
            "The online store is part of the Shoppers Mart project family. It focuses on an online product catalogue, shopping cart functionality, and order management for a furniture retailer selling new and second-hand furniture.",

        technologies: [
            "ASP.NET Core MVC",
            "C#",
            "Azure SQL",
            "Entity Framework",
            "Razor Views"
        ],

        features: [
            "Product catalogue",
            "Product search",
            "Shopping cart",
            "Order management",
            "Product administration"
        ],

        challenges: [],

        lessonsLearned: [],

        coverImage: "",

        galleryImages: [],

        githubUrl: "",

        liveUrl: "",

        year: "",

        role: "Developer"
    },


    // ========================================================
    // 05. EVENT-PRO RENTAL MANAGEMENT
    // ========================================================
    {
        id: "event-pro",

        title: "Event-Pro Rental Management",

        subtitle: "Event Equipment & Rental Operations",

        category: "business",

        status: "Academic Project",

        featured: true,

        summary:
            "A rental management system for event equipment such as tents, chairs, tables, and cold rooms.",

        purpose:
            "To help organise rental inventory and support the management of equipment bookings and rental operations.",

        description:
            "Event-Pro focuses on managing equipment rented for events. The original portfolio describes functionality around rental inventory, delivery scheduling, online payments, and invoicing.",

        technologies: [
            "ASP.NET MVC",
            "C#",
            "Entity Framework",
            "Azure SQL",
            "JavaScript"
        ],

        features: [
            "Rental inventory tracking",
            "Equipment rental management",
            "Delivery scheduling",
            "Online payment workflow",
            "Invoice generation"
        ],

        challenges: [],

        lessonsLearned: [],

        coverImage: "",

        galleryImages: [],

        githubUrl: "",

        liveUrl: "",

        year: "",

        role: "Developer"
    },


    // ========================================================
    // 06. APPRISING HOTEL MANAGEMENT
    // ========================================================
    {
        id: "apprising",

        title: "Apprising Hotel Management",

        subtitle: "Desktop Reservations & Billing",

        category: "desktop",

        status: "Academic Project",

        featured: true,

        summary:
            "A desktop hotel management application for handling reservations, guest check-ins, room allocation, and billing.",

        purpose:
            "To simplify common hotel administration tasks through a desktop application with file-based data storage.",

        description:
            "Apprising is a desktop application developed using C# Windows Forms. Its original portfolio description highlights hotel reservations, guest check-ins, billing, room allocation, reports, and guest history, with information persisted using text files.",

        technologies: [
            "C#",
            "Windows Forms",
            ".NET Framework",
            "Text File Storage"
        ],

        features: [
            "Hotel reservation management",
            "Guest check-in support",
            "Room allocation",
            "Billing",
            "Billing reports",
            "Guest history"
        ],

        challenges: [],

        lessonsLearned: [],

        coverImage: "",

        galleryImages: [],

        githubUrl: "",

        liveUrl: "",

        year: "",

        role: "Developer"
    }

];


// ============================================================
// OPTIONAL HELPER
// Retrieve a project by its unique id.
// Other scripts can use this helper when needed.
// ============================================================

window.getPortfolioProjectById = function (projectId) {
    return window.PORTFOLIO_PROJECTS.find(function (project) {
        return project.id === projectId;
    }) || null;
};
