document.addEventListener('DOMContentLoaded', () => {

  // --- STICKY HEADER & SCROLL TRACKING ---
  const header = document.getElementById('main-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // --- SPA ROUTER & NAVIGATION ---
  const navItems = document.querySelectorAll('.nav-item');
  const sections = document.querySelectorAll('.page-section');
  
  function navigateToSection(hash) {
    const targetId = hash.substring(1) || 'home';
    const targetSection = document.getElementById(targetId);
    
    if (targetSection) {
      // Hide all sections with transition delay
      sections.forEach(sec => {
        sec.classList.remove('active');
      });
      
      // Update active nav link (excluding the main CTA button)
      navItems.forEach(item => {
        const itemHash = item.getAttribute('href');
        if (itemHash === hash || (hash === '' && itemHash === '#home')) {
          if (!item.classList.contains('btn')) {
            item.classList.add('active');
          }
        } else {
          item.classList.remove('active');
        }
      });
      
      // Show target section
      targetSection.classList.add('active');
      
      // Scroll to top of page/section smoothly
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  }

  // Handle nav clicks
  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const hash = item.getAttribute('href');
      history.pushState(null, null, hash);
      navigateToSection(hash);
      
      // Close mobile menu if active
      navMenu.classList.remove('active');
      menuToggle.classList.remove('active');
    });
  });

  // Handle other links pointing to sections
  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('.nav-trigger');
    if (trigger) {
      e.preventDefault();
      const hash = trigger.getAttribute('href');
      history.pushState(null, null, hash);
      navigateToSection(hash);
    }
  });

  // Initial routing on page load
  const initialHash = window.location.hash;
  navigateToSection(initialHash);

  // Listen for popstate (back/forward browser buttons)
  window.addEventListener('popstate', () => {
    navigateToSection(window.location.hash);
  });

  // --- MOBILE MENU TOGGLE ---
  const menuToggle = document.getElementById('menu-toggle');
  const navMenu = document.getElementById('nav-menu');

  menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
  });

  // --- FAQ ACCORDION ---
  const faqHeaders = document.querySelectorAll('.faq-header');
  faqHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const item = header.parentElement;
      const isActive = item.classList.contains('active');
      
      // Close all open FAQs
      document.querySelectorAll('.faq-item').forEach(i => {
        i.classList.remove('active');
        i.querySelector('.faq-body').style.maxHeight = null;
      });

      if (!isActive) {
        item.classList.add('active');
        const body = item.querySelector('.faq-body');
        body.style.maxHeight = body.scrollHeight + 'px';
      }
    });
  });

  // --- VIRTUAL SYMPTOM ADVISOR ENGINE ---
  const regionData = {
    'neck-shoulder': {
      title: 'Neck & Shoulder Region',
      urgency: 'Clinical Care Recommended',
      conditions: 'Rotator Cuff Tendinitis, Shoulder Impingement Syndrome, Cervical Radiculopathy (pinched nerve), Tension Headaches, or Postural Kyphosis.',
      treatment: 'We focus on manual myofascial release, joint mobilizations to restore shoulder glide, and targeted strengthening of the rotator cuff and upper-back postural stabilizers to eliminate pressure.'
    },
    'back': {
      title: 'Spine & Lower Back',
      urgency: 'Active Rehabilitation Recommended',
      conditions: 'Herniated/Bulging Disc, Lumbar Facet Joint Syndrome, Sciatica, SI Joint Dysfunction, or muscular guarding spasms.',
      treatment: 'Treatment involves spinal traction, manual mobilizations to decompress nerve roots, dry needling for deep back spasm relief, and focused core stabilization (multifidus & transverse abdominis strengthening).'
    },
    'knee-hip': {
      title: 'Hip & Knee Joint',
      urgency: 'Biomechanical Check Advised',
      conditions: 'Knee Osteoarthritis, Patellofemoral Pain Syndrome (Runner\'s Knee), IT Band Syndrome, Hip Labral Tears, or Hip Flexor Tendinitis.',
      treatment: 'We correct lower-limb alignment and gait patterns, strengthen gluteal stabilizers, perform manual patellofemoral mobilizations, and design progressive closed-chain exercises to rebuild load tolerance.'
    },
    'foot-ankle': {
      title: 'Ankle & Foot',
      urgency: 'Functional Evaluation Advised',
      conditions: 'Plantar Fasciitis, Achilles Tendonitis/Tendinosis, Chronic Ankle Instability, or Metatarsalgia.',
      treatment: 'We perform joint mobilizations of the ankle mortise, design custom eccentric strengthening for Achilles recovery, teach calf and plantar fascia self-releases, and retrain balance/proprioception.'
    }
  };

  const anatomyBtns = document.querySelectorAll('.anatomy-btn');
  const resultsPlaceholder = document.getElementById('advisor-placeholder');
  const resultsContent = document.getElementById('advisor-content');
  const resultTitle = document.getElementById('result-region-title');
  const resultUrgency = document.getElementById('result-care-urgency');
  const resultConditions = document.getElementById('result-conditions');
  const resultTreatment = document.getElementById('result-treatment');
  const advisorBookBtn = document.getElementById('advisor-book-btn');
  
  let activeRegionKey = null;

  anatomyBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active states
      anatomyBtns.forEach(b => b.classList.remove('active'));
      
      // Set active
      btn.classList.add('active');
      
      const regionKey = btn.getAttribute('data-region');
      activeRegionKey = regionKey;
      const data = regionData[regionKey];
      
      if (data) {
        resultsPlaceholder.style.display = 'none';
        
        // Hide content first to trigger animation reset
        resultsContent.classList.remove('active');
        
        // Trigger reflow
        void resultsContent.offsetWidth;
        
        // Update content values
        resultTitle.textContent = data.title;
        resultUrgency.textContent = data.urgency;
        resultConditions.textContent = data.conditions;
        resultTreatment.textContent = data.treatment;
        
        resultsContent.classList.add('active');

        // Scroll to results panel on mobile/tablet viewports so users see the update immediately
        if (window.innerWidth <= 1024) {
          const resultsPanel = document.getElementById('advisor-results-panel');
          if (resultsPanel) {
            resultsPanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }
        }
      }
    });
  });

  // Link Advisor click straight to Booking
  advisorBookBtn.addEventListener('click', () => {
    if (activeRegionKey) {
      const reasonSelect = document.getElementById('booking-reason');
      reasonSelect.value = activeRegionKey;
    }
    history.pushState(null, null, '#booking');
    navigateToSection('#booking');
  });


  // --- BOOKING SYSTEM STATE & LOGIC ---
  let bookingState = {
    currentStep: 1,
    service: 'ortho', // ortho, sports, manual
    serviceName: 'Orthopedic Rehabilitation',
    date: null,
    time: null,
  };

  const stepContents = document.querySelectorAll('.booking-form-step');
  const stepIndicators = document.querySelectorAll('.step-indicator');
  const btnBack = document.getElementById('btn-booking-back');
  const btnNext = document.getElementById('btn-booking-next');

  // Step 1: Select Service Cards
  const serviceCards = document.querySelectorAll('.service-select-card');
  serviceCards.forEach(card => {
    card.addEventListener('click', () => {
      serviceCards.forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      bookingState.service = card.getAttribute('data-service');
      bookingState.serviceName = card.getAttribute('data-name');
    });
  });

  // Step 2: Calendar Generation & Slots
  const calendarMonthYear = document.getElementById('calendar-month-year');
  const calendarDaysGrid = document.getElementById('calendar-days-grid');
  const selectedDateLabel = document.getElementById('selected-date-label');
  const slotsBtnGrid = document.getElementById('slots-btn-grid');

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  function setupCalendar() {
    // Generate dates starting from June 4, 2026 (User's current local date in metadata)
    const startDate = new Date('2026-06-04');
    
    // Set month and year label
    calendarMonthYear.textContent = `${months[startDate.getMonth()]} ${startDate.getFullYear()}`;
    
    // Clear dynamic day elements (keep headers)
    const headers = calendarDaysGrid.querySelectorAll('.calendar-header');
    calendarDaysGrid.innerHTML = '';
    headers.forEach(h => calendarDaysGrid.appendChild(h));

    // Align calendar starting day (June 4, 2026 is Thursday, so we pad Mon-Wed empty spots to align headers)
    const startDayIndex = startDate.getDay() === 0 ? 6 : startDate.getDay() - 1;
    for (let p = 0; p < startDayIndex; p++) {
      const spacer = document.createElement('div');
      spacer.className = 'calendar-day empty-spacer';
      spacer.style.visibility = 'hidden';
      spacer.style.pointerEvents = 'none';
      calendarDaysGrid.appendChild(spacer);
    }

    // Let's create an elegant rolling week view showing 14 days of booking availability.
    for (let i = 0; i < 14; i++) {
      const current = new Date(startDate);
      current.setDate(startDate.getDate() + i);

      // Sundays are disabled for rest
      const isSunday = current.getDay() === 0;
      
      const dayCard = document.createElement('div');
      dayCard.className = 'calendar-day';
      if (isSunday) dayCard.classList.add('disabled');
      
      // Store date string
      const dateString = current.toISOString().split('T')[0];
      dayCard.setAttribute('data-date', dateString);

      const dayNum = document.createElement('span');
      dayNum.className = 'day-num';
      dayNum.textContent = current.getDate();

      dayCard.appendChild(dayNum);

      if (!isSunday) {
        dayCard.addEventListener('click', () => {
          document.querySelectorAll('.calendar-day:not(.empty-spacer)').forEach(d => d.classList.remove('selected'));
          dayCard.classList.add('selected');
          bookingState.date = dateString;
          
          // Formats display label
          const options = { weekday: 'long', month: 'short', day: 'numeric' };
          selectedDateLabel.textContent = current.toLocaleDateString('en-US', options);
          
          loadTimeSlots(dateString);
        });
      }

      calendarDaysGrid.appendChild(dayCard);
    }
  }

  // Pre-set standard times
  const timeSlots = [
    '09:00 AM', '10:30 AM', '11:45 AM', '01:00 PM', '02:30 PM', '04:00 PM', '05:30 PM'
  ];

  function loadTimeSlots(dateString) {
    slotsBtnGrid.innerHTML = '';
    bookingState.time = null; // reset selected time

    // To simulate a real live database, we'll block off some slots depending on the selected date
    // (e.g. even dates block morning, odd dates block afternoon)
    const dateNum = parseInt(dateString.replace(/-/g, ''));
    
    timeSlots.forEach((time, index) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'slot-btn';
      btn.textContent = time;

      // Seed mock booked slots
      const isBooked = (dateNum + index) % 3 === 0;
      if (isBooked) {
        btn.classList.add('disabled');
        btn.setAttribute('disabled', 'true');
      } else {
        btn.addEventListener('click', () => {
          document.querySelectorAll('.slot-btn').forEach(s => s.classList.remove('selected'));
          btn.classList.add('selected');
          bookingState.time = time;
        });
      }

      slotsBtnGrid.appendChild(btn);
    });
  }

  function updateStepsUI() {
    // Hide all steps
    stepContents.forEach(content => content.classList.remove('active'));
    
    // Show current step
    document.getElementById(`step-content-${bookingState.currentStep}`).classList.add('active');

    // Update Indicators
    stepIndicators.forEach((ind, index) => {
      const stepNum = index + 1;
      ind.classList.remove('active', 'completed');
      
      if (stepNum === bookingState.currentStep) {
        ind.classList.add('active');
      } else if (stepNum < bookingState.currentStep) {
        ind.classList.add('completed');
      }
    });

    // Control navigation button states
    if (bookingState.currentStep === 1) {
      btnBack.style.visibility = 'hidden';
      btnNext.textContent = 'Next';
    } else {
      btnBack.style.visibility = 'visible';
      
      if (bookingState.currentStep === 3) {
        btnNext.textContent = 'Submit Booking';
      } else {
        btnNext.textContent = 'Next';
      }
    }
  }

  btnNext.addEventListener('click', () => {
    if (bookingState.currentStep === 1) {
      // Setup calendar if it's the first time moving to step 2
      setupCalendar();
      selectedDateLabel.textContent = 'Choose a day above';
      slotsBtnGrid.innerHTML = '<p class="text-muted" style="grid-column: 1/-1;">Please select a date first.</p>';
      
      bookingState.currentStep = 2;
      updateStepsUI();
    } 
    else if (bookingState.currentStep === 2) {
      if (!bookingState.date) {
        showToast('Please select a booking date.', 'warning');
        return;
      }
      if (!bookingState.time) {
        showToast('Please select an appointment time slot.', 'warning');
        return;
      }
      bookingState.currentStep = 3;
      updateStepsUI();
    } 
    else if (bookingState.currentStep === 3) {
      // Form validation
      const name = document.getElementById('booking-name').value.trim();
      const email = document.getElementById('booking-email').value.trim();
      const phone = document.getElementById('booking-phone').value.trim();

      if (!name || !email || !phone) {
        showToast('Please fill out all contact fields.', 'warning');
        return;
      }

      // Check email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        showToast('Please enter a valid email address.', 'warning');
        return;
      }

      // Submit successful!
      submitBooking(name);
    }
  });

  btnBack.addEventListener('click', () => {
    if (bookingState.currentStep > 1) {
      bookingState.currentStep--;
      updateStepsUI();
    }
  });

  function submitBooking(name) {
    // Show premium booking modal / alert
    showToast(`Appointment Confirmed! Thank you, ${name}.`, 'success');
    
    // Reset booking state
    bookingState = {
      currentStep: 1,
      service: 'ortho',
      serviceName: 'Orthopedic Rehabilitation',
      date: null,
      time: null,
    };

    // Reset Inputs
    document.getElementById('booking-form').reset();
    document.querySelectorAll('.service-select-card').forEach(c => c.classList.remove('selected'));
    document.querySelector('[data-service="ortho"]').classList.add('selected');

    // Go back to step 1
    updateStepsUI();

    // Scroll to top of section
    window.scrollTo({
      top: document.getElementById('booking').offsetTop - 80,
      behavior: 'smooth'
    });
  }

  // --- TOAST NOTIFICATION POPUPS ---
  const toastContainer = document.getElementById('toast-holder');

  function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    let svgIcon = '';
    if (type === 'success') {
      svgIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>`;
    } else {
      svgIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>`;
    }

    toast.innerHTML = `
      ${svgIcon}
      <span>${message}</span>
    `;

    toastContainer.appendChild(toast);

    // Trigger transition
    setTimeout(() => {
      toast.classList.add('show');
    }, 50);

    // Auto-remove toast after 4 seconds
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => {
        toast.remove();
      }, 400);
    }, 4000);
  }

});
