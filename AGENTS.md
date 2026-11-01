# TerraVilla development notes

- Keep frontend features grouped under `src/components/`.
- Use `src/lib/api.js` for calls to the Express API.
- Keep authentication changes in `src/context/AuthContext.jsx` and `backend/routes/auth.js`.
- Do not add a third-party backend-as-a-service dependency for application logic.
- Keep Tailwind CSS on the 3.x line.
