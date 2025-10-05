(function() {
	// Ensure background music continues
	try { window.startBackgroundMusic && window.startBackgroundMusic('homepage'); } catch(e) {}

	const nameInput = document.getElementById('astronautName');
	const codenameInput = document.getElementById('astronautCodename');
	const generateBtn = document.getElementById('generateBtn');
	const downloadBtn = document.getElementById('downloadBtn');
	const certName = document.getElementById('certName');
	const certCodename = document.getElementById('certCodename');
	const certDate = document.getElementById('certDate');
	const certEl = document.getElementById('certificate');

	function isUnlocked() {
		try {
			return window.state && Number(window.state.trophies) >= Number(window.state.maxTrophies || 12);
		} catch(e) { return false; }
	}

	function guardUnlock() {
		if (!isUnlocked()) {
			alert('Earn all 12/12 trophies to unlock your Astronaut Certificate.');
			window.location.href = '../index.html';
		}
	}

	function updateDate() {
		const now = new Date();
		const formatted = now.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
		certDate.textContent = formatted;
	}

	function applyValues() {
		const nameVal = (nameInput.value || '').trim();
		const codeVal = (codenameInput.value || '').trim();
		certName.textContent = nameVal || '—';
		certCodename.textContent = codeVal || '—';
	}

	async function downloadImage() {
		// Capture exactly what's on screen at high DPI (no size overrides)
		await new Promise(r => setTimeout(r, 20));
		const canvas = await html2canvas(certEl, { scale: 3, backgroundColor: null, useCORS: true, logging: false });
		const dataUrl = canvas.toDataURL('image/png');
		const link = document.createElement('a');
		const safeName = (nameInput.value || 'Astronaut').replace(/[^a-z0-9_\-\s]/gi, '').slice(0, 40);
		const safeCode = (codenameInput.value || 'STAR').replace(/[^a-z0-9_\-\s]/gi, '').slice(0, 24);
		link.download = `ISSperience-Certificate_${safeName}_${safeCode}.png`;
		link.href = dataUrl;
		link.click();
	}

	function init() {
		guardUnlock();
		updateDate();
		applyValues();

		nameInput.addEventListener('input', applyValues);
		codenameInput.addEventListener('input', applyValues);

		generateBtn.addEventListener('click', () => {
			applyValues();
			window.playSound && window.playSound('achievement');
			downloadBtn.disabled = false;
		});

		downloadBtn.addEventListener('click', async () => {
			if (downloadBtn.disabled) return;
			try {
				await downloadImage();
				window.showNotification && window.showNotification('🖼️ Certificate image downloaded!', 'success');
			} catch (err) {
				console.error('Image download failed', err);
				alert('Image generation failed. Please try again.');
			}
		});
	}

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', init);
	} else {
		init();
	}
})();


