# 🚀 Quick Reference Card

## 🔗 Important Links

- **Landing Page:** `http://localhost:8000`
- **Project Docs:** `README.md`
- **Dev Guide:** `DEVELOPMENT_GUIDE.md`
- **Summary:** `PROJECT_SUMMARY.md`

---

## 📁 File Structure

```
index.html              ← Main page (start here!)
css/styles.css          ← All styling
js/main.js              ← All interactivity
assets/
  ├── images/           ← Add graphics here
  └── sounds/           ← Add audio here (MP3)
```

---

## 🎨 Color Variables (CSS)

```css
--space-blue-dark: #0B1929    /* Background */
--cyan-bright: #00D9FF        /* Primary accent */
--orange-warm: #FF6B35        /* Secondary accent */
--glass-bg: rgba(255,255,255,0.05)  /* Cards */
```

Change these in `css/styles.css` at line 9-20

---

## 🎮 Easter Eggs & Interactions

1. **Konami Code:** ↑↑↓↓←→←→BA → Rainbow effect
2. **Double-click astronaut** → Spin animation
3. **Click floating ISS** → Spin + random ISS fact!
   - Click 5 times → Special achievement
   - Click 10 times → Unlock secret honor!
4. **Module card hover** → 3D tilt effect
5. **ISS auto-pulses** → Glows every 10 seconds

---

## 🔊 Adding Sounds

1. Create/download MP3 files:
   - `startup.mp3`, `click.mp3`, `hover.mp3`
   - `launch.mp3`, `achievement.mp3`, `woosh.mp3`

2. Place in `assets/sounds/`

3. Uncomment lines 48-52 in `js/main.js`:
```javascript
const audio = new Audio(`assets/sounds/${soundName}.mp3`);
audio.volume = 0.3;
audio.play().catch(err => console.log('Audio play failed:', err));
```

---

## 🎯 Module Cards (Current State)

All set to "Coming Soon" (locked state):
1. 🪟 Cupola Window
2. 🌍 Is My World Okay?!
3. 🎮 Zero-G Training Lab
4. 🌙 Lunar Observatory
5. 📚 Knowledge Center
6. 🏆 Astronaut Certification

**To unlock:** Change `disabled` attribute and badge class in HTML

---

## 🛠️ Common Tasks

### Start Dev Server
```bash
npm start
# or
npx http-server -p 8000 -o
```

### Edit Colors
1. Open `css/styles.css`
2. Find `:root` section (line 9)
3. Change color hex values
4. Refresh browser

### Add New Particle Emoji
1. Open `js/main.js`
2. Find line 31: `const particleEmojis = [...]`
3. Add emoji to array
4. Refresh browser

### Change Animation Speed
Find animation in `css/styles.css`:
```css
animation: floatAnimation 6s infinite;
/* Change 6s to desired duration */
```

---

## 🐛 Quick Debugging

### Page won't load
- Check browser console (F12)
- Verify file paths are correct
- Ensure server is running

### Animations laggy
- Reduce particle count (line 29 in `js/main.js`)
- Check browser performance
- Close other tabs

### Styles not applying
- Hard refresh: Ctrl+Shift+R (Cmd+Shift+R on Mac)
- Clear browser cache
- Check CSS file path in HTML

---

## 📱 Test Responsive

**Browser DevTools:**
1. Press F12
2. Click device icon (Ctrl+Shift+M)
3. Select device:
   - iPhone SE (375x667)
   - iPad (768x1024)
   - Desktop (1920x1080)

---

## ✅ Pre-Flight Checklist

Before showing to others:
- [ ] Test all interactive elements
- [ ] Check on mobile device
- [ ] Verify animations are smooth
- [ ] Test sound toggle
- [ ] Check typos in text
- [ ] Test in different browsers

---

## 🚀 Next Module to Build

**Recommended: Cupola Window**

1. Create `modules/cupola.html`
2. Create `css/cupola.css`
3. Create `js/cupola.js`
4. Integrate `globe.gl-master` library
5. Add back button to landing page
6. Update card in `index.html`:
   - Remove `disabled` from button
   - Change badge to "unlocked"
   - Link to `modules/cupola.html`

---

## 💡 Quick Tips

- **Save often** - Ctrl+S is your friend
- **Test in browser** - Refresh after each change
- **Check console** - F12 for errors
- **Use comments** - Future you will thank you
- **Git commit** - Save progress regularly

---

## 🎨 Design Tokens

### Spacing
- xs: 0.5rem (8px)
- sm: 1rem (16px)
- md: 1.5rem (24px)
- lg: 2rem (32px)
- xl: 3rem (48px)

### Border Radius
- sm: 8px
- md: 16px
- lg: 24px
- full: 9999px (circle)

### Transitions
- fast: 200ms
- normal: 300ms
- slow: 500ms

---

## 🔥 Hot Keys

- **F12** - Open DevTools
- **Ctrl+Shift+R** - Hard refresh
- **Ctrl+Shift+M** - Toggle device mode
- **Ctrl+Shift+C** - Inspect element
- **Ctrl+/** - Comment/uncomment code

---

## 📞 Get Help

1. Check `DEVELOPMENT_GUIDE.md`
2. Look at browser console errors
3. Search MDN Web Docs
4. Check `README.md` for project info

---

## 🎉 Celebrate Wins!

- ✅ Landing page complete
- ✅ Animations working
- ✅ Responsive design done
- ✅ Accessibility included
- 🎯 Ready for modules!

---

**Keep this file handy! Bookmark it! 📌**

*Last updated: October 3, 2025*

