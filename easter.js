window.onload = function() {

  // ── Make the second hole in #contact clickable ──
  var contact = document.getElementById('contact');
  if (contact) {
    var holes = contact.querySelectorAll('.hole');
    holes.forEach(function(h) {
      h.style.pointerEvents = 'auto';
      h.style.zIndex = '99999';
      h.style.position = 'absolute';
    });
  }

  var items = [
    { src: 'images/Carnation_Lily_Lily_Rose_John_Singer_Sargent.jpg', label: 'Carnation, Lily, Lily, Rose — Sargent' },
    { src: 'images/Roses_by_Claude_Monet.jpg', label: 'The Roses — Monet' },
    { src: 'images/Pierre_Bonnard_Seascape_in_a_Southern_French_Port.jpg', label: 'Côte d\'Azur — Bonnard' },
    { src: 'images/Le_Cours_de_la_Seine_par_Raoul_Dufy.jpg', label: 'La Seine — Dufy' },
    { src: 'images/pat_stein_garden.jpg', label: 'Painted Rain No. 8 — Pat Steir' },
    { src: 'images/the_phantom_tollbooth_norton_juster.jpg', label: 'The Phantom Tollbooth' },
    { src: 'images/bereadywhentheluckhappens_inagarten.jpg', label: 'Be Ready When the Luck Happens — Ina Garten' },
    { src: 'images/The_Sun_Also_Rises_cover_Ernest_Hemingway.jpg', label: 'The Sun Also Rises — Hemingway' },
    { src: 'images/East_of_Eden_John_Steinbeck.jpg', label: 'East of Eden — Steinbeck' }
  ];

  var folder = null;
  var overlay = null;
  var cards = [];
  var isOpen = false;

  // ── Document-level delegation — catches click regardless of z-stack ──
  document.addEventListener('click', function(e) {
    var contactEl = document.getElementById('contact');
    if (!contactEl) return;
    var contactHoles = contactEl.querySelectorAll('.hole');
    var secondHole = contactHoles[1];
    if (!secondHole) return;
    if (e.target !== secondHole && !secondHole.contains(e.target)) return;

    if (!folder) {
      showFolder();
    } else {
      if (isOpen) { closeGallery(); } else { openGallery(); }
    }
  });

  function showFolder() {
    folder = document.createElement('img');
    folder.src = 'images/macfolder.png';
    folder.style.position = 'fixed';
    folder.style.bottom = '60px';
    folder.style.left = '10px';
    folder.style.width = '64px';
    folder.style.height = '64px';
    folder.style.objectFit = 'contain';
    folder.style.zIndex = '999999';
    folder.style.cursor = 'pointer';
    folder.style.transform = 'scale(0)';
    folder.style.transition = 'transform 0.5s cubic-bezier(0.34,1.56,0.64,1)';
    document.body.appendChild(folder);
    setTimeout(function() { folder.style.transform = 'scale(1)'; }, 10);
    folder.addEventListener('click', function(e) {
      e.stopPropagation();
      if (isOpen) { closeGallery(); } else { openGallery(); }
    });
  }

  function openGallery() {
    isOpen = true;
    overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.inset = '0';
    overlay.style.background = 'rgba(0,3,33,0.25)';
    overlay.style.zIndex = '800';
    overlay.style.opacity = '0';
    overlay.style.transition = 'opacity 0.4s ease';
    overlay.addEventListener('click', closeGallery);
    document.body.appendChild(overlay);
    setTimeout(function() { overlay.style.opacity = '1'; }, 10);

    var W = window.innerWidth;
    var H = window.innerHeight;

    // Constrain cards to a centered 75vw × 75vh area
    var areaW = W * 0.75;
    var areaH = H * 0.75;
    var areaLeft = (W - areaW) / 2;
    var areaTop  = (H - areaH) / 2;

    items.forEach(function(item, i) {
      var col = i % 3;
      var row = Math.floor(i / 3);
      var cellW = areaW / 3;
      var cellH = areaH / 3;
      var x = areaLeft + col * cellW + cellW / 2 + (Math.random() * 30 - 15);
      var y = areaTop  + row * cellH + cellH / 2 + (Math.random() * 20 - 10);
      var rot = (Math.random() * 16) - 8;

      var card = document.createElement('div');
      card.style.position = 'fixed';
      card.style.width = '150px';
      card.style.background = 'white';
      card.style.borderRadius = '3px';
      card.style.boxShadow = '0 8px 32px rgba(0,0,0,0.35)';
      card.style.zIndex = '900';
      card.style.overflow = 'hidden';
      card.style.left = x + 'px';
      card.style.top = y + 'px';
      card.style.transform = 'translate(-50%,-50%) rotate(' + rot + 'deg) scale(0)';
      card.style.transition = 'transform 0.5s cubic-bezier(0.34,1.56,0.64,1)';
      card.style.transitionDelay = (i * 0.05) + 's';

      var img = document.createElement('img');
      img.src = item.src;
      img.style.width = '100%';
      img.style.height = '180px';
      img.style.objectFit = 'cover';
      img.style.display = 'block';

      var label = document.createElement('p');
      label.textContent = item.label;
      label.style.fontFamily = '"Cormorant Garamond", serif';
      label.style.fontSize = '10px';
      label.style.textAlign = 'center';
      label.style.padding = '8px 6px';
      label.style.margin = '0';
      label.style.color = '#000321';
      label.style.lineHeight = '1.4';

      card.appendChild(img);
      card.appendChild(label);
      document.body.appendChild(card);
      cards.push(card);

      setTimeout(function() {
        card.style.transform = 'translate(-50%,-50%) rotate(' + rot + 'deg) scale(1)';
      }, 10);
    });
  }

  window.addEventListener('scroll', function() {
    if (folder) {
      closeGallery();
      if (folder && folder.parentNode) folder.parentNode.removeChild(folder);
      folder = null;
      isOpen = false;
    }
  }, { passive: true });

  function closeGallery() {
    isOpen = false;
    cards.forEach(function(c) {
      if (c.parentNode) c.parentNode.removeChild(c);
    });
    cards = [];
    if (overlay && overlay.parentNode) overlay.parentNode.removeChild(overlay);
    overlay = null;
  }

};
