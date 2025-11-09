# API Key Security Best Practices

## 🚨 The Problem

Your Google Maps API key was exposed in the compiled JavaScript bundle at:
`/static/js/main.62cbbedc.chunk.js`

**Why did this happen?**

- React bundles all code (including `process.env` values) into the final JavaScript files
- These files are publicly accessible when deployed
- Anyone can extract API keys from the bundled code

## ✅ Solutions (In Order of Priority)

### 1. **IMMEDIATE: Regenerate the Exposed Key**

⚠️ **DO THIS FIRST** ⚠️

1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Find the exposed key: `AIzaSyAFjagYUP76eJQmoDDGze9TtHboIBpY_0s`
3. Click "Regenerate Key"
4. Update your local `.env` file with the new key
5. **DO NOT** commit `.env` to git

### 2. **Add API Key Restrictions**

Even if exposed, restricted keys limit damage:

#### Application Restrictions:

- **HTTP referrers**: Restrict to your domain(s)
  ```
  https://yourdomain.com/*
  https://*.yourdomain.com/*
  http://localhost:3000/* (for local dev)
  ```

#### API Restrictions:

- Limit to only the APIs you use:
  - ✅ Geocoding API
  - ❌ Uncheck everything else

### 3. **Never Commit Build Files**

Your `.gitignore` already includes `/build` ✅

**Verify it's working:**

```bash
git status
# The build/ folder should NOT appear in untracked files
```

If `build/` appears in git history, remove it:

```bash
# Remove from git history (use with caution)
git filter-branch --force --index-filter \
  "git rm -r --cached --ignore-unmatch build/" \
  --prune-empty --tag-name-filter cat -- --all
```

### 4. **Use a Backend Proxy (Most Secure)**

**Current:** Client → Google Maps API (key exposed)
**Better:** Client → Your Backend → Google Maps API (key secure)

See `backend-example/` for implementation details.

### 5. **Monitor API Usage**

Set up alerts in Google Cloud Console:

- Enable billing alerts
- Set quota limits
- Monitor for unusual activity

### 6. **Use Environment-Specific Keys**

Create separate API keys for:

- **Development**: `REACT_APP_GOOGLE_MAPS_API_KEY_DEV` (localhost only)
- **Production**: `REACT_APP_GOOGLE_MAPS_API_KEY_PROD` (your domain only)

## 📋 Checklist

- [ ] Regenerate the exposed API key
- [ ] Add HTTP referrer restrictions
- [ ] Add API restrictions (Geocoding only)
- [ ] Verify `.env` is in `.gitignore`
- [ ] Verify `build/` is in `.gitignore`
- [ ] Never commit `.env` or `build/` folders
- [ ] Consider implementing backend proxy
- [ ] Set up billing alerts
- [ ] Review current API usage for abuse

## 🔍 How to Check for Exposed Keys

Search your repository:

```bash
# Check for hardcoded API keys
git grep -E "AIza[0-9A-Za-z-_]{35}"

# Check git history for exposed keys
git log -p -S "AIzaSy" --all
```

## 📚 Additional Resources

- [Google API Key Best Practices](https://cloud.google.com/docs/authentication/api-keys)
- [Securing API Keys in React](https://create-react-app.dev/docs/adding-custom-environment-variables/)
- [GitHub Secret Scanning](https://docs.github.com/en/code-security/secret-scanning/about-secret-scanning)

## ⚠️ Remember

**Environment variables in Create React App are PUBLIC in the final bundle!**

- They're meant for configuration, not secrets
- Any `REACT_APP_*` variable is embedded in the build
- Users can always view them in DevTools or source code
- For true security, use a backend proxy
