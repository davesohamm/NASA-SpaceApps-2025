# 🔧 Troubleshooting Guide - Earth Check Module

## Issue: "Downloading Earth imagery... 0%" - Image Not Loading

### ✅ **FIXED in v0.3.1**

**Problem:** Browser CORS (Cross-Origin Resource Sharing) restrictions prevented direct access to Himawari-8 server.

**Solution:** Added CORS proxy (`corsproxy.io`) to fetch images through a proxy server.

---

## How to Test the Fix

### 1. **Hard Refresh Browser**
- Windows/Linux: `Ctrl + Shift + R` or `Ctrl + F5`
- Mac: `Cmd + Shift + R`

### 2. **Check Browser Console**
1. Press `F12` to open Developer Tools
2. Go to **Console** tab
3. You should see:
   ```
   🌍 Earth Check module initializing...
   Fetching latest timestamp from: https://corsproxy.io/?...
   Latest timestamp data: {date: "..."}
   Loading tile 0_0 from: https://corsproxy.io/?...
   Tile loaded: 0_0
   ✅ Earth image loaded successfully
   ```

### 3. **Check Network Tab**
1. In DevTools, go to **Network** tab
2. Reload the page
3. Look for requests to `corsproxy.io`
4. They should show `200 OK` status

---

## Common Issues & Solutions

### Issue 1: Still Stuck at 0%

**Cause:** Browser cache showing old version

**Solution:**
```bash
1. Clear browser cache completely
   - Chrome: Ctrl+Shift+Delete → "Cached images and files" → Clear
   - Firefox: Ctrl+Shift+Delete → "Cache" → Clear Now
   
2. Close and reopen browser

3. Navigate to: http://localhost:8000/modules/earth-check.html
```

---

### Issue 2: Console Shows "Failed to fetch"

**Cause:** CORS proxy might be temporarily down or slow

**Solutions:**

**A. Wait and retry** (proxy might be slow)
- The module auto-retries 3 times
- Wait 15-20 seconds

**B. Alternative CORS Proxies** (if corsproxy.io is down)

Edit `modules/js/earth-check.js` line 9:

```javascript
// Option 1: Original (currently used)
corsProxy: 'https://corsproxy.io/?',

// Option 2: Alternative proxy
corsProxy: 'https://api.allorigins.win/raw?url=',

// Option 3: Another alternative
corsProxy: 'https://cors-anywhere.herokuapp.com/',
```

---

### Issue 3: Images Load Very Slowly

**Cause:** High zoom level or slow network

**Solutions:**
1. Start with **Zoom 1x** (fastest - 1 tile)
2. Wait for first load before zooming
3. Use lower zoom on slower connections
4. CORS proxy adds latency (expected)

**Load times:**
- Zoom 1x: 3-5 seconds
- Zoom 2x: 10-15 seconds (4 tiles through proxy)
- Zoom 3x: 20-30 seconds (8 tiles through proxy)

---

### Issue 4: Tile Errors in Console

**Cause:** Some tiles might fail to load

**Solution:** This is normal and handled automatically
- Failed tiles show as dark gray squares
- Module continues loading other tiles
- Usually 1-2 tiles out of many succeed

---

### Issue 5: "latest.json" Fetch Fails

**Cause:** Timestamp endpoint blocked or slow

**Solution:** Module has automatic fallback
- Falls back to current system time
- Rounds to nearest 10-minute interval
- Might show slightly older image (still recent)

Check console for:
```
Using fallback time: [current time]
```

---

## Debug Mode

### Enable Detailed Logging

Open browser console (F12) and run:

```javascript
// See all fetch attempts
localStorage.setItem('debugEarthCheck', 'true');

// Then reload page
location.reload();
```

This will show:
- All URL requests
- Proxy URLs being used
- Each tile load attempt
- Timing information

---

## Alternative: Test Without CORS Proxy

If you want to test the original API (will fail due to CORS):

1. Edit `modules/js/earth-check.js`
2. Comment out proxy usage:

```javascript
// Line 129 - Comment out proxy
const url = `${HIMAWARI_CONFIG.baseUrl}/latest.json`;
// const url = `${HIMAWARI_CONFIG.corsProxy}${encodeURIComponent(...)}`;

// Line 238 - Comment out proxy  
img.src = url;
// const proxiedUrl = `${HIMAWARI_CONFIG.corsProxy}${encodeURIComponent(url)}`;
// img.src = proxiedUrl;
```

**Expected result:** Console will show CORS errors (this proves the proxy is necessary)

---

## Server-Side Alternative (Advanced)

For production use, consider creating a backend proxy instead of using public CORS proxies:

### Node.js Express Example

```javascript
// server.js
const express = require('express');
const fetch = require('node-fetch');
const app = express();

app.get('/api/himawari/latest', async (req, res) => {
    const response = await fetch('https://himawari8-dl.nict.go.jp/himawari8/img/D531106/latest.json');
    const data = await response.json();
    res.json(data);
});

app.get('/api/himawari/tile/:path(*)', async (req, res) => {
    const url = `https://himawari8-dl.nict.go.jp/himawari8/img/D531106/${req.params.path}`;
    const response = await fetch(url);
    const buffer = await response.buffer();
    res.type('image/png').send(buffer);
});

app.listen(3000);
```

Then update `HIMAWARI_CONFIG.baseUrl` to point to your server.

---

## Verify Fix is Applied

Check these files have been updated:

**File: `modules/js/earth-check.js`**
- Line 9: Should have `corsProxy: 'https://corsproxy.io/?',`
- Line 129: Should use `corsProxy` in URL
- Line 238: Should use `corsProxy` in URL

**File: `modules/earth-check.html`**
- Line 9: Should have `?v=0.3.1`
- Line 180: Should have `?v=0.3.1`

---

## Testing Checklist

After applying fixes:

- [ ] Hard refresh browser (Ctrl+Shift+R)
- [ ] Open browser console (F12)
- [ ] Go to earth-check.html
- [ ] See "Fetching latest timestamp" in console
- [ ] See "Loading tile 0_0" messages
- [ ] See "Tile loaded: 0_0" messages
- [ ] See Earth image appear on canvas
- [ ] Progress goes from 0% to 100%
- [ ] Loading overlay disappears
- [ ] Image info shows capture time

---

## Still Having Issues?

### Check These:

1. **Internet Connection**
   - Proxy requires internet access
   - Test by visiting: https://corsproxy.io in browser

2. **Browser Compatibility**
   - Use modern browser (Chrome 90+, Firefox 88+, Safari 14+)
   - IE 11 not supported

3. **JavaScript Enabled**
   - Ensure JS is not blocked
   - Check browser extensions (ad blockers might interfere)

4. **Server Running**
   - Ensure http-server is running on port 8000
   - Check terminal for errors

5. **File Paths**
   - Verify all files exist in correct locations
   - Check case sensitivity (Linux/Mac)

---

## Success Indicators

**You'll know it's working when:**

✅ Progress bar goes from 0% to 100%  
✅ Loading overlay fades out  
✅ Earth image appears (blue/white/green)  
✅ Capture time shows in top-right overlay  
✅ No red errors in browser console  
✅ Countdown timer starts (e.g., "9:59")  

---

## Contact / Report

If issues persist after trying all solutions:

1. **Copy browser console output**
   - Press F12 → Console tab
   - Right-click → "Save as..."
   
2. **Take screenshot** of the stuck loading screen

3. **Note your environment:**
   - Browser & version
   - Operating system
   - Internet connection type

---

**Last Updated:** October 3, 2025  
**Version:** 0.3.1  
**Status:** CORS Issue Fixed ✅

