# Deployment & Cloud Run Questions

## What is WebRTC?

WebRTC (Web Real-Time Communication) is a technology that enables peer-to-peer audio, video, and data sharing directly between browsers and devices, without requiring an intermediary server. It is commonly used for video calls, voice calls, and real-time data exchange in web applications.

## What is Web Bluetooth/USB API?

Web Bluetooth and Web USB are browser APIs that allow web applications to communicate directly with Bluetooth and USB devices connected to the user's computer. These APIs enable web apps to interact with hardware like fitness trackers, printers, or custom devices.

## Why is it used here?

The popup you saw indicates that the deployed app is requesting permission to access devices on your local network, likely using one of these APIs. This could be for features like device discovery, direct hardware communication, or real-time peer-to-peer connections. If your app does not require such features, this may be unnecessary or could be caused by a library or code that attempts to use these APIs.

## How does nginx work in a container (not as a service)?

nginx is a lightweight, high-performance web server and reverse proxy. In a containerized environment (like Docker or Cloud Run), nginx is not run as a system service (like on a traditional VM), but as the main process of the container. The container starts by running the nginx process directly, usually via the Dockerfile's CMD or ENTRYPOINT.

- The container image includes the nginx binary and configuration files.
- When the container starts, nginx runs in the foreground (not as a background service/daemon).
- nginx listens on the configured port (e.g., 8080) inside the container.
- Cloud Run (or Docker) maps incoming traffic to this port.
- When the container stops, nginx stops as well.

This is different from a VM, where nginx might be managed by systemd or another init system. In containers, the main process (PID 1) is nginx itself.

This approach is standard for all web servers in containers (nginx, Apache, etc.).

---

_Add more questions and answers as needed._
