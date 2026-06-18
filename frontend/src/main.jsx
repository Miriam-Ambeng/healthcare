import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  ArrowLeft,
  Bell,
  CalendarDays,
  Check,
  Clock3,
  Download,
  FileText,
  Heart,
  Lock,
  Mail,
  MapPin,
  Menu,
  Phone,
  Search,
  Star,
  User,
  X
} from "lucide-react";
import "./styles.css";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
const SPECIALTIES = ["All", "Cardiology", "Pediatrics", "Dermatology", "Dentistry", "Neurology", "Orthopedics", "Gynecology"];
const DOCTOR_SPECIALTIES = ["Cardiology", "Pediatrics", "Dermatology", "Dentistry", "Neurology", "Orthopedics", "Gynecology"];
const LANGUAGES = [
  { value: "en", label: "English" },
  { value: "fr", label: "French" }
];
const TEXT = {
  en: {
    getStarted: "Get Started",
    footerNote: "Regional Hospital Buea, Cameroon",
    welcomeTitle: "Regional Hospital Buea",
    welcomeSubtitle: "Book appointments, manage clinic schedules, and receive care reminders from one trusted hospital portal.",
    welcomeBack: "Welcome Back",
    signInContinue: "Sign in to continue",
    email: "Email",
    password: "Password",
    forgotPassword: "Forgot Password?",
    signIn: "Sign In",
    signingIn: "Signing in...",
    noAccount: "Don't have an account?",
    signUp: "Sign Up",
    createAccount: "Create Account",
    createAccountAction: "Create Account",
    creating: "Creating...",
    signupSubtitle: "Sign up to get started",
    fullName: "Full Name",
    phoneNumber: "Phone Number",
    accountType: "Account Type",
    patient: "Client",
    doctor: "Doctor",
    preferredLanguage: "Preferred Language",
    specialty: "Specialty",
    onmcNumber: "ONMC Matricule Number",
    onmcNotice: "Invalid ONMC matricule.",
    passwordPlaceholder: "At least 6 characters",
    passwordHelper: "Password must be at least 6 characters.",
    forgotPasswordEmail: "Recovery Email",
    forgotPasswordHelp: "Enter your email and the hospital administrator will help reset your password.",
    sendResetRequest: "Submit Reset Request",
    resetRequestNotice: "Password reset request recorded. Please contact the hospital administrator to complete the reset.",
    passwordNotice: "Password must be at least 6 characters.",
    findDoctor: "Find a Specialist",
    searchPlaceholder: "Search by specialty or name",
    signOut: "Sign out",
    book: "Book",
    bookAppointment: "Book Appointment",
    selectDateTime: "Select date and time",
    selectDate: "Select Date",
    availableSlots: "Available Time Slots",
    noSlots: "No slots available for this date.",
    selectSlot: "Select a time slot.",
    selectReminder: "Select at least one reminder method.",
    reason: "Reason",
    previousMedicalReport: "Previous Medical Report",
    uploadMedicalReport: "Upload previous medical report",
    medicalReportHelper: "Upload a previous medical report image. This is required.",
    reportDetails: "Medical Report Details",
    age: "Age",
    bloodPressure: "Blood Pressure",
    height: "Height",
    temperature: "Temperature",
    consultation: "Previous Consultation",
    pressure: "Pulse / Pressure",
    weight: "Weight",
    allergies: "Allergies",
    otherMedicalInfo: "Other Important Information",
    reportMissing: "Please upload the previous medical report image and complete the important medical report details before continuing.",
    selectedReport: "Selected report",
    reportTooLarge: "Medical report must be an image and 3 MB or less.",
    reportReadError: "Unable to read the selected medical report.",
    continue: "Continue",
    reminders: "Appointment Reminders",
    reminderSubtitle: "How would you like to be reminded?",
    reminderMethod: "Reminder Method",
    reminderInstruction: "Select one or more ways to receive reminders",
    reminderNumber: "Reminder",
    reminderTime: "Send Date and Time",
    emailReminder: "Get email reminders",
    sms: "SMS",
    smsReminder: "Text message alerts",
    push: "Push Notification",
    pushReminder: "App notifications",
    phoneCall: "Phone Call",
    phoneReminder: "Automated call reminder",
    preferences: "Your Preferences",
    continueConfirmation: "Continue to Confirmation",
    continuePayment: "Continue to Payment",
    paymentTitle: "Reminder Payment",
    paymentSubtitle: "Pay for SMS or WhatsApp reminder charges",
    paymentMethod: "Payment Method",
    orangeMoney: "Orange Money",
    mobileMoney: "MTN Mobile Money",
    paymentPhone: "Payment Phone Number",
    paymentAmount: "Amount to Pay",
    paymentReference: "Payment Reference",
    confirmPayment: "Pay and Continue",
    paymentNotice: "Enter a valid Cameroon mobile number, for example +237 670940984.",
    paymentPrompt: "A payment request will be sent to this number. Confirm the prompt on your phone to continue.",
    paidReminderNotice: "SMS and WhatsApp reminders cost 25 FRS each. Email reminders are free.",
    confirmed: "Appointment Confirmed!",
    confirmedSubtitle: "Your appointment has been successfully booked",
    bookingId: "Booking ID",
    downloadReceipt: "Download Receipt",
    backHome: "Back to Home",
    myAppointments: "My Appointments",
    doctorSchedule: "Client Schedule",
    appointmentsSubtitle: "Upcoming and recent bookings",
    noAppointments: "No appointments yet.",
    cancelAppointment: "Cancel Appointment",
    cancelling: "Cancelling...",
    cancellationRule: "Clients can cancel only at least 24 hours before the appointment time.",
    cancelWindowClosed: "Cancellation window closed",
    cancelConfirm: "Cancel this appointment?",
    viewClientDetails: "View Client Details",
    hideClientDetails: "Hide Client Details",
    clientInformation: "Client Information",
    appointmentInformation: "Appointment Information",
    doctorDesk: "Doctor Desk",
    welcomeDoctor: "Welcome",
    workingDay: "Working Day",
    workingDays: "Working Days",
    start: "Start",
    end: "End",
    slotMinutes: "Slot Minutes",
    saveSchedule: "Save Schedule",
    viewAppointments: "View Appointments"
  },
  fr: {
    getStarted: "Commencer",
    footerNote: "Hopital Regional de Buea, Cameroun",
    welcomeTitle: "Hopital Regional de Buea",
    welcomeSubtitle: "Prenez rendez-vous, gerez les horaires de clinique et recevez des rappels depuis un portail hospitalier fiable.",
    welcomeBack: "Bon Retour",
    signInContinue: "Connectez-vous pour continuer",
    email: "Email",
    password: "Mot de passe",
    forgotPassword: "Mot de passe oublie ?",
    signIn: "Se connecter",
    signingIn: "Connexion...",
    noAccount: "Vous n'avez pas de compte ?",
    signUp: "S'inscrire",
    createAccount: "Creer un Compte",
    createAccountAction: "Creer le Compte",
    creating: "Creation...",
    signupSubtitle: "Inscrivez-vous pour commencer",
    fullName: "Nom complet",
    phoneNumber: "Numero de telephone",
    accountType: "Type de compte",
    patient: "Client",
    doctor: "Medecin",
    preferredLanguage: "Langue preferee",
    specialty: "Specialite",
    onmcNumber: "Numero Matricule ONMC",
    onmcNotice: "Matricule ONMC invalide.",
    passwordPlaceholder: "Au moins 6 caracteres",
    passwordHelper: "Le mot de passe doit contenir au moins 6 caracteres.",
    forgotPasswordEmail: "Email de recuperation",
    forgotPasswordHelp: "Entrez votre email et l'administrateur de l'hopital vous aidera a reinitialiser le mot de passe.",
    sendResetRequest: "Envoyer la demande",
    resetRequestNotice: "Demande de reinitialisation enregistree. Veuillez contacter l'administrateur de l'hopital pour terminer.",
    passwordNotice: "Le mot de passe doit contenir au moins 6 caracteres.",
    findDoctor: "Trouver un Specialiste",
    searchPlaceholder: "Rechercher par specialite ou par nom",
    signOut: "Deconnexion",
    book: "Reserver",
    bookAppointment: "Reserver un Rendez-vous",
    selectDateTime: "Selectionnez la date et l'heure",
    selectDate: "Selectionner la Date",
    availableSlots: "Creneaux Disponibles",
    noSlots: "Aucun creneau disponible pour cette date.",
    selectSlot: "Selectionnez un creneau.",
    selectReminder: "Selectionnez au moins une methode de rappel.",
    reason: "Motif",
    previousMedicalReport: "Ancien Rapport Medical",
    uploadMedicalReport: "Televerser un ancien rapport medical",
    medicalReportHelper: "Televersez une image de l'ancien rapport medical. Ceci est obligatoire.",
    reportDetails: "Details du Rapport Medical",
    age: "Age",
    bloodPressure: "Tension arterielle",
    height: "Taille",
    temperature: "Temperature",
    consultation: "Consultation precedente",
    pressure: "Pouls / Pression",
    weight: "Poids",
    allergies: "Allergies",
    otherMedicalInfo: "Autres informations importantes",
    reportMissing: "Veuillez televerser l'image de l'ancien rapport medical et completer les informations importantes du rapport medical avant de continuer.",
    selectedReport: "Rapport selectionne",
    reportTooLarge: "Le rapport medical doit etre une image de 3 Mo maximum.",
    reportReadError: "Impossible de lire le rapport medical selectionne.",
    continue: "Continuer",
    reminders: "Rappels de Rendez-vous",
    reminderSubtitle: "Comment voulez-vous etre rappele ?",
    reminderMethod: "Methode de Rappel",
    reminderInstruction: "Selectionnez une ou plusieurs methodes de rappel",
    reminderNumber: "Rappel",
    reminderTime: "Date et Heure d'envoi",
    emailReminder: "Recevoir des rappels par email",
    sms: "SMS",
    smsReminder: "Alertes par message texte",
    push: "Notification Push",
    pushReminder: "Notifications dans l'application",
    phoneCall: "Appel Telephonique",
    phoneReminder: "Rappel par appel automatique",
    preferences: "Vos Preferences",
    continueConfirmation: "Continuer vers la Confirmation",
    continuePayment: "Continuer au Paiement",
    paymentTitle: "Paiement des Rappels",
    paymentSubtitle: "Payez les frais des rappels SMS ou WhatsApp",
    paymentMethod: "Methode de Paiement",
    orangeMoney: "Orange Money",
    mobileMoney: "MTN Mobile Money",
    paymentPhone: "Numero de Paiement",
    paymentAmount: "Montant a Payer",
    paymentReference: "Reference de Paiement",
    confirmPayment: "Payer et Continuer",
    paymentNotice: "Entrez un numero mobile camerounais valide, par exemple +237 670940984.",
    paymentPrompt: "Une demande de paiement sera envoyee a ce numero. Confirmez la demande sur votre telephone pour continuer.",
    paidReminderNotice: "Les rappels SMS et WhatsApp coutent 25 FRS chacun. Les rappels Email sont gratuits.",
    confirmed: "Rendez-vous Confirme !",
    confirmedSubtitle: "Votre rendez-vous a ete reserve avec succes",
    bookingId: "ID de Reservation",
    downloadReceipt: "Telecharger le Recu",
    backHome: "Retour a l'accueil",
    myAppointments: "Mes Rendez-vous",
    doctorSchedule: "Planning des Clients",
    appointmentsSubtitle: "Reservations a venir et recentes",
    noAppointments: "Aucun rendez-vous pour le moment.",
    cancelAppointment: "Annuler le Rendez-vous",
    cancelling: "Annulation...",
    cancellationRule: "Les clients peuvent annuler uniquement au moins 24 heures avant l'heure du rendez-vous.",
    cancelWindowClosed: "Delai d'annulation ferme",
    cancelConfirm: "Annuler ce rendez-vous ?",
    viewClientDetails: "Voir les Details du Client",
    hideClientDetails: "Masquer les Details du Client",
    clientInformation: "Informations du Client",
    appointmentInformation: "Informations du Rendez-vous",
    doctorDesk: "Espace Medecin",
    welcomeDoctor: "Bienvenue",
    workingDay: "Jour de Travail",
    workingDays: "Jours de Travail",
    start: "Debut",
    end: "Fin",
    slotMinutes: "Minutes par Creneau",
    saveSchedule: "Enregistrer le Planning",
    viewAppointments: "Voir les Rendez-vous"
  }
};
const DEMO_DOCTOR = {
  _id: "demo-doctor",
  name: "Sarah Johnson",
  specialization: "Cardiology",
  schedule: []
};

function storedJson(key) {
  try {
    return JSON.parse(localStorage.getItem(key));
  } catch {
    return null;
  }
}

function formatDateInput(date) {
  return date.toISOString().slice(0, 10);
}

function nextDates(count = 7) {
  return Array.from({ length: count }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() + index);
    return {
      iso: formatDateInput(date),
      day: date.toLocaleDateString("en", { weekday: "short" }),
      date: date.toLocaleDateString("en", { day: "2-digit" }),
      month: date.toLocaleDateString("en", { month: "short" })
    };
  });
}

function toDatetimeLocal(date) {
  const next = new Date(date);
  next.setMinutes(next.getMinutes() - next.getTimezoneOffset());
  return next.toISOString().slice(0, 16);
}

function defaultReminderTimes(appointmentDate, startTime) {
  const [hours, minutes] = startTime.split(":").map(Number);
  const appointment = new Date(`${appointmentDate}T00:00:00`);
  appointment.setHours(hours, minutes || 0, 0, 0);

  return [24 * 60, 3 * 60, 60].map((minutesBefore) => {
    const reminder = new Date(appointment.getTime() - minutesBefore * 60 * 1000);
    return toDatetimeLocal(reminder);
  });
}

function getAppointmentStart(appointment) {
  const date = appointment.appointmentDate?.slice(0, 10);
  if (!date || !appointment.startTime) {
    return null;
  }
  return new Date(`${date}T${appointment.startTime}:00`);
}

function canPatientCancelAppointment(appointment) {
  if (appointment.status !== "confirmed" && appointment.status !== "pending") {
    return false;
  }
  const start = getAppointmentStart(appointment);
  return Boolean(start && start.getTime() - Date.now() >= 24 * 60 * 60 * 1000);
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = String(reader.result || "");
      resolve(result.includes(",") ? result.split(",")[1] : result);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function App() {
  const [screen, setScreen] = useState(localStorage.getItem("healthcare_token") ? "doctors" : "welcome");
  const [token, setToken] = useState(localStorage.getItem("healthcare_token") || "");
  const [user, setUser] = useState(storedJson("healthcare_user"));
  const [language, setLanguage] = useState(storedJson("healthcare_user")?.preferredLanguage || localStorage.getItem("healthcare_language") || "en");
  const [notice, setNotice] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [booking, setBooking] = useState(null);
  const t = (key) => TEXT[language]?.[key] || TEXT.en[key] || key;

  const api = useMemo(() => {
    async function request(path, options = {}) {
      const response = await fetch(`${API_BASE_URL}${path}`, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          "Accept-Language": language,
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...(options.headers || {})
        }
      });

      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(payload.message || payload.errors?.[0]?.msg || "Request failed.");
      }
      return payload;
    }
    return { request };
  }, [language, token]);

  function saveSession(nextToken, nextUser) {
    const nextLanguage = nextUser.preferredLanguage || language;
    setToken(nextToken);
    setUser(nextUser);
    setLanguage(nextLanguage);
    localStorage.setItem("healthcare_token", nextToken);
    localStorage.setItem("healthcare_user", JSON.stringify(nextUser));
    localStorage.setItem("healthcare_language", nextLanguage);
    setScreen(nextUser.role === "doctor" ? "doctorHome" : "doctors");
  }

  function signOut() {
    setToken("");
    setUser(null);
    localStorage.removeItem("healthcare_token");
    localStorage.removeItem("healthcare_user");
    setScreen("welcome");
  }

  function showNotice(message) {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 3500);
  }

  return (
    <div className="phone-stage">
      <div className="phone-frame">
        <div className="phone-notch" />
        <div className="phone-screen">
          <SiteHeader
            screen={screen}
            user={user}
            language={language}
            setLanguage={setLanguage}
            t={t}
            goHome={() => setScreen("welcome")}
            goDoctorHome={() => setScreen("doctorHome")}
            goDoctors={() => setScreen("doctors")}
            goAppointments={() => setScreen("appointments")}
            goLogin={() => setScreen("login")}
            signOut={signOut}
          />
          {notice && <Toast message={notice} />}

          {screen === "welcome" && <WelcomePage goLogin={() => setScreen("login")} t={t} language={language} setLanguage={setLanguage} />}
          {screen === "login" && <LoginPage api={api} saveSession={saveSession} goBack={() => setScreen("welcome")} goSignup={() => setScreen("signup")} showNotice={showNotice} t={t} />}
          {screen === "signup" && <SignupPage api={api} saveSession={saveSession} goBack={() => setScreen("login")} showNotice={showNotice} language={language} setLanguage={setLanguage} t={t} />}
          {screen === "doctors" && (
            <DoctorsPage
              api={api}
              user={user}
              signOut={signOut}
              openAppointments={() => setScreen("appointments")}
              chooseDoctor={(doctor) => {
                setSelectedDoctor(doctor);
                setScreen("book");
              }}
              showNotice={showNotice}
              t={t}
            />
          )}
          {screen === "book" && selectedDoctor && (
            <BookPage
              api={api}
              doctor={selectedDoctor}
              goBack={() => setScreen("doctors")}
              continueReminder={(nextBooking) => {
                setBooking(nextBooking);
                setScreen("reminders");
              }}
              showNotice={showNotice}
              t={t}
            />
          )}
          {screen === "reminders" && booking && (
            <ReminderPage
              api={api}
              booking={booking}
              goBack={() => setScreen("book")}
              t={t}
              showNotice={showNotice}
              openPayment={(nextBooking) => {
                setBooking(nextBooking);
                setScreen("payment");
              }}
              confirm={(confirmedBooking) => {
                setBooking(confirmedBooking);
                setScreen("confirmation");
              }}
            />
          )}
          {screen === "payment" && booking && (
            <PaymentPage
              api={api}
              booking={booking}
              goBack={() => setScreen("reminders")}
              t={t}
              showNotice={showNotice}
              confirm={(confirmedBooking) => {
                setBooking(confirmedBooking);
                setScreen("confirmation");
              }}
            />
          )}
          {screen === "confirmation" && booking && <ConfirmationPage booking={booking} backHome={() => setScreen("doctors")} t={t} />}
          {screen === "appointments" && <AppointmentsPage api={api} user={user} goBack={() => setScreen(user?.role === "doctor" ? "doctorHome" : "doctors")} showNotice={showNotice} t={t} />}
          {screen === "doctorHome" && <DoctorHome api={api} user={user} signOut={signOut} openAppointments={() => setScreen("appointments")} showNotice={showNotice} t={t} />}
          <SiteFooter />
        </div>
      </div>
    </div>
  );
}

function SiteHeader({ screen, user, language, setLanguage, t, goHome, goDoctorHome, goDoctors, goAppointments, goLogin, signOut }) {
  const isDoctor = user?.role === "doctor";
  const navItems = [
    { label: "Home", active: screen === "welcome", onClick: goHome, show: true },
    { label: t("doctorDesk"), active: screen === "doctorHome", onClick: goDoctorHome, show: isDoctor },
    { label: t("findDoctor"), active: screen === "doctors" || screen === "book" || screen === "reminders" || screen === "payment" || screen === "confirmation", onClick: goDoctors, show: user?.role === "patient" },
    { label: isDoctor ? t("doctorSchedule") : t("myAppointments"), active: screen === "appointments", onClick: goAppointments, show: Boolean(user) }
  ];

  return (
    <header className="site-header">
      <div className="site-header-inner">
        <button className="brand-button" type="button" onClick={goHome}>
          <span className="brand-icon"><Heart size={20} fill="currentColor" /></span>
          <span>
            <strong>Regional Hospital Buea</strong>
            <small>Appointment Portal</small>
          </span>
        </button>
        <nav aria-label="Main navigation">
          {navItems.filter((item) => item.show).map((item) => (
            <button
              key={item.label}
              className={item.active ? "active" : ""}
              type="button"
              onClick={item.onClick}
            >
              {item.label}
            </button>
          ))}
        </nav>
      <div className="site-actions">
        <select value={language} onChange={(event) => {
          setLanguage(event.target.value);
          localStorage.setItem("healthcare_language", event.target.value);
        }}>
          {LANGUAGES.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
        </select>
        {user ? (
          <button className="outline-small" type="button" onClick={signOut}>{t("signOut")}</button>
        ) : (
          <button className="outline-small" type="button" onClick={goLogin}>{t("signIn")}</button>
        )}
      </div>
      </div>
    </header>
  );
}

function SiteFooter() {
  return (
    <footer className="site-footer">
      <div>
        <strong>Regional Hospital Buea</strong>
        <span>Automated hospital appointment system for Buea, Cameroon</span>
      </div>
      <div>
        <span>Email reminders</span>
        <span>SMS alerts</span>
        <span>WhatsApp messages</span>
      </div>
    </footer>
  );
}

function Toast({ message }) {
  return (
    <div className="toast">
      <span>{message}</span>
    </div>
  );
}

function BackButton({ onClick }) {
  return (
    <button className="icon-button" type="button" onClick={onClick} aria-label="Go back">
      <ArrowLeft size={30} />
    </button>
  );
}

function WelcomePage({ goLogin, t }) {
  const heroSlides = [
    {
      title: "Cardiology clinic",
      status: "8 slots open today",
      note: "Heart and blood pressure consultations",
      icon: Heart
    },
    {
      title: "Pediatrics unit",
      status: "5 doctors available",
      note: "Child health appointments and follow-up visits",
      icon: User
    },
    {
      title: "Orthopedics desk",
      status: "Next slot 10:30 AM",
      note: "Bone, joint, and injury specialist bookings",
      icon: CalendarDays
    }
  ];
  const waitingImages = [
    {
      src: "/images/doctor-hero.jpg",
      title: "Specialist consultation",
      caption: "A calm, guided appointment experience from booking to confirmation."
    },
    {
      src: "/images/waiting-1.jpg",
      title: "Clients waiting for care",
      caption: "Queue pressure is reduced when appointment times are clearly managed."
    },
    {
      src: "/images/waiting-2.jpg",
      title: "Hospital reception support",
      caption: "Staff and doctors can see scheduled visits before clients arrive."
    },
    {
      src: "/images/waiting-3.jpg",
      title: "Prepared clinical visit",
      caption: "Vitals and previous medical details are available before consultation."
    }
  ];
  const [activeSlide, setActiveSlide] = useState(0);
  const [activeImage, setActiveImage] = useState(0);
  const activeHero = heroSlides[activeSlide];
  const activeWaitingImage = waitingImages[activeImage];
  const ActiveHeroIcon = activeHero.icon;

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % heroSlides.length);
    }, 3200);
    return () => window.clearInterval(timer);
  }, [heroSlides.length]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveImage((current) => (current + 1) % waitingImages.length);
    }, 4200);
    return () => window.clearInterval(timer);
  }, [waitingImages.length]);

  return (
    <section className="page welcome-page">
      <div className="home-hero-shell">
      <div className="hero-pulse one" />
      <div className="hero-pulse two" />
      <div className="welcome-copy">
        <p className="hospital-kicker">Regional Hospital Buea, Cameroon</p>
        <div className="brand-mark">
          <Heart size={54} fill="white" />
        </div>
        <h1>{t("welcomeTitle")}</h1>
        <p>{t("welcomeSubtitle")}</p>
        <div className="hero-highlights">
          <span>Client booking</span>
          <span>Doctor schedules</span>
          <span>Care reminders</span>
        </div>
        <div className="live-service-panel" aria-live="polite">
          <span className="live-dot" />
          <div className="live-service-icon"><ActiveHeroIcon size={22} /></div>
          <div>
            <strong>{activeHero.title}</strong>
            <span>{activeHero.status} - {activeHero.note}</span>
          </div>
        </div>
        <div className="hero-actions">
          <button className="primary-action" type="button" onClick={goLogin}>
            {t("getStarted")}
          </button>
          <a className="secondary-action" href="#hospital-services">View hospital services</a>
        </div>
        <div className="hero-trust-grid" aria-label="Hospital appointment highlights">
          <span><strong>24/7</strong> Online booking access</span>
          <span><strong>3</strong> Reminder channels</span>
          <span><strong>+237</strong> Cameroon phone support</span>
        </div>
      </div>
      <aside className="hero-image-panel" aria-label="Regional Hospital Buea care team">
        <div className="hero-shape shape-one" />
        <div className="hero-shape shape-two" />
        <img key={activeWaitingImage.src} src={activeWaitingImage.src} alt={activeWaitingImage.title} />
        <div className="hero-stat-card">
          <strong>{activeWaitingImage.title}</strong>
          <span>{activeWaitingImage.caption}</span>
        </div>
        <div className="floating-appointment-card primary">
          <span>Now booking</span>
          <strong>{activeHero.title}</strong>
          <small>{activeHero.status}</small>
        </div>
        <div className="floating-appointment-card secondary">
          <span>Reminder queue</span>
          <strong>Email / SMS / WhatsApp</strong>
          <small>3 reminders per appointment</small>
        </div>
      </aside>
      </div>
      <div className="home-dashboard-strip">
        <article>
          <strong>126</strong>
          <span>Appointments coordinated this week</span>
        </article>
        <article>
          <strong>18</strong>
          <span>Specialists managing schedules</span>
        </article>
        <article>
          <strong>94%</strong>
          <span>Reminder-ready bookings</span>
        </article>
        <article>
          <strong>2</strong>
          <span>Languages supported</span>
        </article>
      </div>
      <div className="home-service-grid" id="hospital-services">
        <article>
          <CalendarDays size={26} />
          <h2>Appointment Calendar</h2>
          <p>Clients choose available dates and time slots while doctors control their working days.</p>
        </article>
        <article>
          <Bell size={26} />
          <h2>Smart Reminders</h2>
          <p>Clients can select email, SMS, or WhatsApp reminders for upcoming appointments.</p>
        </article>
        <article>
          <Check size={26} />
          <h2>Clinic Workflow</h2>
          <p>Doctors and clients use one consistent portal for schedules, booking status, and confirmations.</p>
        </article>
      </div>
    </section>
  );
}

function LoginPage({ api, saveSession, goBack, goSignup, showNotice, t }) {
  const [email, setEmail] = useState("patient@test.com");
  const [password, setPassword] = useState("password123");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setLoading(true);
    try {
      const result = await api.request("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password })
      });
      saveSession(result.token, result.data);
      showNotice(result.message);
    } catch (error) {
      showNotice(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="page form-page">
      <BackButton onClick={goBack} />
      <header className="page-title">
        <h1>{t("welcomeBack")}</h1>
        <p>{t("signInContinue")}</p>
      </header>
      <form onSubmit={submit} className="mobile-form">
        <InputField label={t("email")} icon={<Mail />} value={email} onChange={setEmail} type="email" />
        <InputField label={t("password")} icon={<Lock />} value={password} onChange={setPassword} type="password" />
        <button className="link-button right" type="button" onClick={() => setShowForgotPassword((current) => !current)}>{t("forgotPassword")}</button>
        {showForgotPassword && (
          <div className="forgot-panel">
            <InputField label={t("forgotPasswordEmail")} icon={<Mail />} value={forgotEmail} onChange={setForgotEmail} type="email" />
            <small>{t("forgotPasswordHelp")}</small>
            <button className="outline-action" type="button" onClick={() => showNotice(t("resetRequestNotice"))}>{t("sendResetRequest")}</button>
          </div>
        )}
        <button className="primary-action" type="submit" disabled={loading}>{loading ? t("signingIn") : t("signIn")}</button>
      </form>
      <p className="switch-auth">{t("noAccount")} <button type="button" onClick={goSignup}>{t("signUp")}</button></p>
    </section>
  );
}

function SignupPage({ api, saveSession, goBack, showNotice, language, setLanguage, t }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "patient",
    specialization: "Cardiology",
    onmcNumber: "",
    preferredLanguage: language
  });
  const [loading, setLoading] = useState(false);

  function update(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function submit(event) {
    event.preventDefault();
    if (form.password.length < 6) {
      showNotice(t("passwordNotice"));
      return;
    }
    if (form.role === "doctor" && !/^\d{4}\/\d{4}$/.test(form.onmcNumber.trim())) {
      showNotice(t("onmcNotice"));
      return;
    }
    setLoading(true);
    try {
      const result = await api.request("/auth/register", {
        method: "POST",
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          password: form.password,
          role: form.role,
          preferredLanguage: form.preferredLanguage,
          ...(form.role === "doctor" ? { specialization: form.specialization, onmcNumber: form.onmcNumber } : {})
        })
      });
      saveSession(result.token, result.data);
      showNotice(result.message);
    } catch (error) {
      showNotice(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="page form-page scrollable">
      <BackButton onClick={goBack} />
      <header className="page-title">
        <h1>{t("createAccount")}</h1>
        <p>{t("signupSubtitle")}</p>
      </header>
      <form onSubmit={submit} className="mobile-form">
        <InputField label={t("fullName")} icon={<User />} value={form.name} onChange={(value) => update("name", value)} placeholder="John Doe" />
        <InputField label={t("email")} icon={<Mail />} value={form.email} onChange={(value) => update("email", value)} placeholder="your.email@example.com" type="email" />
        <InputField label={t("phoneNumber")} icon={<Phone />} value={form.phone} onChange={(value) => update("phone", value)} placeholder="+237 6XX XXX XXX" helper="+237 Cameroon country code is required for SMS and WhatsApp reminders." />
        <InputField label={t("password")} icon={<Lock />} value={form.password} onChange={(value) => update("password", value)} placeholder={t("passwordPlaceholder")} type="password" minLength={6} helper={t("passwordHelper")} />
        <label className="select-field">
          <span>{t("accountType")}</span>
          <select value={form.role} onChange={(event) => update("role", event.target.value)}>
            <option value="patient">{t("patient")}</option>
            <option value="doctor">{t("doctor")}</option>
          </select>
        </label>
        <label className="select-field">
          <span>{t("preferredLanguage")}</span>
          <select value={form.preferredLanguage} onChange={(event) => {
            update("preferredLanguage", event.target.value);
            setLanguage(event.target.value);
            localStorage.setItem("healthcare_language", event.target.value);
          }}>
            {LANGUAGES.map((language) => (
              <option key={language.value} value={language.value}>{language.label}</option>
            ))}
          </select>
        </label>
        {form.role === "doctor" && (
          <>
            <InputField label={t("onmcNumber")} icon={<FileText />} value={form.onmcNumber} onChange={(value) => update("onmcNumber", value)} placeholder="ONMC matricule" />
            <label className="select-field">
              <span>{t("specialty")}</span>
              <select value={form.specialization} onChange={(event) => update("specialization", event.target.value)}>
                {DOCTOR_SPECIALTIES.map((specialty) => (
                  <option key={specialty} value={specialty}>{specialty}</option>
                ))}
              </select>
            </label>
          </>
        )}
        <button className="primary-action" type="submit" disabled={loading}>{loading ? t("creating") : t("createAccountAction")}</button>
      </form>
    </section>
  );
}

function InputField({ label, icon, value, onChange, type = "text", placeholder = "", minLength, helper }) {
  return (
    <label className="input-field">
      <span>{label}</span>
      <div>
        {React.cloneElement(icon, { size: 25 })}
        <input type={type} value={value} placeholder={placeholder} minLength={minLength} onChange={(event) => onChange(event.target.value)} required />
      </div>
      {helper && <small>{helper}</small>}
    </label>
  );
}

function DoctorsPage({ api, user, signOut, openAppointments, chooseDoctor, showNotice, t }) {
  const [doctors, setDoctors] = useState([]);
  const [query, setQuery] = useState("");
  const [specialty, setSpecialty] = useState("All");

  useEffect(() => {
    api.request("/doctors")
      .then((result) => setDoctors(result.data.length ? result.data : [DEMO_DOCTOR]))
      .catch((error) => {
        setDoctors([DEMO_DOCTOR]);
        showNotice(error.message);
      });
  }, [api, showNotice]);

  const filtered = doctors.filter((doctor) => {
    const search = `${doctor.name} ${doctor.specialization}`.toLowerCase();
    const matchesSearch = search.includes(query.toLowerCase());
    const matchesSpecialty = specialty === "All" || doctor.specialization === specialty;
    return matchesSearch && matchesSpecialty;
  });

  return (
    <section className="page find-page">
      <header className="blue-header">
        <div className="header-row">
          <div>
            <p className="section-kicker">Regional Hospital Buea</p>
            <h1>{t("findDoctor")}</h1>
          </div>
          <button className="icon-button light" type="button" onClick={openAppointments}><Menu size={30} /></button>
        </div>
        <div className="search-box">
          <Search size={25} />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t("searchPlaceholder")} />
        </div>
        <div className="chip-row">
          {SPECIALTIES.map((item) => (
            <button key={item} className={specialty === item ? "active" : ""} type="button" onClick={() => setSpecialty(item)}>
              {item}
            </button>
          ))}
        </div>
      </header>

      <div className="content-list">
        <div className="mini-profile">
          <span>Hi, {user?.name?.split(" ")[0] || "Client"}</span>
          <button type="button" onClick={signOut}>{t("signOut")}</button>
        </div>
        {filtered.map((doctor, index) => (
          <DoctorCard key={doctor._id || index} doctor={doctor} onBook={() => chooseDoctor(doctor)} t={t} />
        ))}
      </div>
    </section>
  );
}

function DoctorCard({ doctor, onBook, t }) {
  return (
    <article className="doctor-card">
      <div className="doctor-avatar">{doctor.name?.includes("Michael") ? "ðŸ‘¨â€âš•ï¸" : "ðŸ‘©â€âš•ï¸"}</div>
      <div className="doctor-info">
        <h2>Dr. {doctor.name}</h2>
        <p>{doctor.specialization || "Specialist"}</p>
        <div className="doctor-meta">
          <span><Star size={18} fill="#f5b400" /> 4.8 (124)</span>
          <span><Clock3 size={17} /> 12 years</span>
        </div>
        <span className="location"><MapPin size={17} /> Regional Hospital Buea</span>
      </div>
      <button className="book-button" type="button" onClick={onBook}>{t("book")}</button>
    </article>
  );
}

function BookPage({ api, doctor, goBack, continueReminder, showNotice, t }) {
  const dates = nextDates(8);
  const [selectedDate, setSelectedDate] = useState(dates[0].iso);
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [medicalReport, setMedicalReport] = useState(null);
  const [reportInfo, setReportInfo] = useState({
    age: "",
    bloodPressure: "",
    height: "",
    temperature: "",
    pressure: "",
    weight: "",
    allergies: ""
  });
  const isDemo = doctor._id === "demo-doctor";

  useEffect(() => {
    if (isDemo) {
      setSlots(["09:00", "09:30", "10:00", "10:30", "11:00", "11:30"].map((time) => ({ startTime: time, available: true })));
      return;
    }
    api.request(`/doctors/${doctor._id}/availability?date=${selectedDate}`)
      .then((result) => setSlots(result.data))
      .catch((error) => showNotice(error.message));
  }, [api, doctor._id, isDemo, selectedDate, showNotice]);

  function holdAppointment() {
    if (!selectedSlot) {
      showNotice(t("selectSlot"));
      return;
    }
    if (!medicalReport || !["age", "bloodPressure", "height", "temperature", "pressure"].every((field) => reportInfo[field].trim())) {
      showNotice(t("reportMissing"));
      return;
    }
    continueReminder({
      doctor,
      doctorId: doctor._id,
      isDemo,
      date: selectedDate,
      startTime: selectedSlot,
      endTime: addHalfHour(selectedSlot),
      reason: "Consultation",
      previousMedicalReport: {
        ...(medicalReport || {}),
        details: reportInfo
      }
    });
  }

  function updateReportInfo(field, value) {
    setReportInfo((current) => ({ ...current, [field]: value }));
  }

  async function handleMedicalReport(event) {
    const file = event.target.files?.[0];
    if (!file) {
      setMedicalReport(null);
      return;
    }

    if (!file.type.startsWith("image/") || file.size > 3 * 1024 * 1024) {
      event.target.value = "";
      setMedicalReport(null);
      showNotice(t("reportTooLarge"));
      return;
    }

    try {
      const data = await fileToBase64(file);
      setMedicalReport({
        fileName: file.name,
        mimeType: file.type || "application/octet-stream",
        size: file.size,
        data
      });
    } catch {
      event.target.value = "";
      setMedicalReport(null);
      showNotice(t("reportReadError"));
    }
  }

  return (
    <section className="page booking-page scrollable">
      <header className="white-header">
        <BackButton onClick={goBack} />
        <h1>{t("bookAppointment")}</h1>
        <p>{t("selectDateTime")}</p>
      </header>
      <div className="booking-content">
        <DoctorCard doctor={doctor} onBook={holdAppointment} t={t} />
        <SectionLabel icon={<CalendarDays />} title={t("selectDate")} />
        <div className="date-row">
          {dates.map((date) => (
            <button key={date.iso} className={selectedDate === date.iso ? "active" : ""} type="button" onClick={() => setSelectedDate(date.iso)}>
              <span>{date.day}</span>
              <strong>{date.date}</strong>
              <span>{date.month}</span>
            </button>
          ))}
        </div>
        <SectionLabel icon={<Clock3 />} title={t("availableSlots")} />
        <div className="time-grid">
          {slots.length === 0 && <p className="empty-text">{t("noSlots")}</p>}
          {slots.map((slot) => (
            <button key={slot.startTime} type="button" disabled={!slot.available} className={selectedSlot === slot.startTime ? "active" : ""} onClick={() => setSelectedSlot(slot.startTime)}>
              {toDisplayTime(slot.startTime)}
            </button>
          ))}
        </div>
        <label className="reason-box file-upload-box">
          <span>{t("previousMedicalReport")}</span>
          <div className="file-upload-control">
            <FileText size={24} />
            <input
              type="file"
              accept="image/png,image/jpeg,image/jpg"
              onChange={handleMedicalReport}
              required
            />
          </div>
          <small>{medicalReport ? `${t("selectedReport")}: ${medicalReport.fileName}` : t("medicalReportHelper")}</small>
        </label>
        <div className="report-details">
          <h3>{t("reportDetails")}</h3>
          <div className="report-grid">
            <InputField label={t("age")} icon={<User />} value={reportInfo.age} onChange={(value) => updateReportInfo("age", value)} type="number" />
            <InputField label={t("bloodPressure")} icon={<Heart />} value={reportInfo.bloodPressure} onChange={(value) => updateReportInfo("bloodPressure", value)} placeholder="120/80 mmHg" />
            <InputField label={t("height")} icon={<FileText />} value={reportInfo.height} onChange={(value) => updateReportInfo("height", value)} placeholder="170 cm" />
            <InputField label={t("temperature")} icon={<FileText />} value={reportInfo.temperature} onChange={(value) => updateReportInfo("temperature", value)} placeholder="37 C" />
            <InputField label={t("pressure")} icon={<Heart />} value={reportInfo.pressure} onChange={(value) => updateReportInfo("pressure", value)} placeholder="Pulse 72 bpm" />
            <InputField label={t("weight")} icon={<FileText />} value={reportInfo.weight} onChange={(value) => updateReportInfo("weight", value)} placeholder="70 kg" />
          </div>
          <label className="reason-box">
            <span>{t("allergies")}</span>
            <textarea value={reportInfo.allergies} onChange={(event) => updateReportInfo("allergies", event.target.value)} rows={2} />
          </label>
        </div>
        <button className="primary-action" type="button" onClick={holdAppointment}>{t("continue")}</button>
      </div>
    </section>
  );
}

function SectionLabel({ icon, title }) {
  return <h2 className="section-label">{React.cloneElement(icon, { size: 27 })} {title}</h2>;
}

function reminderCharge(reminders) {
  return reminders.filter((reminder) => reminder.method === "sms" || reminder.method === "whatsapp").length * 25;
}

async function submitAppointment(api, booking, reminders) {
  const result = await api.request("/appointments", {
    method: "POST",
    body: JSON.stringify({
      doctorId: booking.doctorId,
      appointmentDate: booking.date,
      startTime: booking.startTime,
      reason: booking.reason,
      previousMedicalReport: booking.previousMedicalReport,
      reminderSchedule: reminders.map((reminder) => ({
        method: reminder.method,
        sendAt: new Date(reminder.sendAt).toISOString()
      }))
    })
  });

  return {
    ...booking,
    reminders,
    appointmentId: result.data._id,
    endTime: result.data.endTime,
    date: result.data.appointmentDate?.slice(0, 10) || booking.date,
    previousMedicalReport: result.data.previousMedicalReport || booking.previousMedicalReport
  };
}

function ReminderPage({ api, booking, goBack, confirm, openPayment, t, showNotice }) {
  const defaultTimes = defaultReminderTimes(booking.date, booking.startTime);
  const [selectedMethod, setSelectedMethod] = useState("sms");
  const [reminderCount, setReminderCount] = useState(2);
  const [reminderTimes, setReminderTimes] = useState(defaultTimes);
  const [loading, setLoading] = useState(false);
  const methodOptions = [
    ["email", "Email"],
    ["sms", t("sms")],
    ["whatsapp", "WhatsApp"]
  ];
  const reminders = reminderTimes.slice(0, reminderCount).map((sendAt) => ({
    method: selectedMethod,
    sendAt
  }));
  const selectedMethodLabel = selectedMethod === "email" ? "Email" : selectedMethod === "sms" ? "Sms" : "WhatsApp";

  function updateReminderTime(index, value) {
    setReminderTimes((current) => current.map((sendAt, itemIndex) => itemIndex === index ? value : sendAt));
  }

  async function createAppointment() {
    if (reminders.some((reminder) => !reminder.method || !reminder.sendAt)) {
      showNotice(t("selectReminder"));
      return;
    }

    const amount = reminderCharge(reminders);

    if (amount > 0) {
      openPayment({ ...booking, reminders, paymentAmount: amount });
      return;
    }

    if (booking.isDemo) {
      confirm({ ...booking, reminders, paymentAmount: 0, appointmentId: "HC-DEMO" });
      return;
    }

    setLoading(true);
    try {
      confirm(await submitAppointment(api, { ...booking, paymentAmount: 0 }, reminders));
    } catch (error) {
      showNotice(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="page reminder-page">
      <header className="white-header">
        <BackButton onClick={goBack} />
        <h1>{t("reminders")}</h1>
        <p>{t("reminderSubtitle")}</p>
      </header>
      <div className="reminder-content">
        <SectionLabel icon={<Bell />} title={t("reminderMethod")} />
        <p>{t("reminderInstruction")}</p>
        <div className="reminder-payment-note">
          <span>Payment notice</span>
          <strong>{t("paidReminderNotice")}</strong>
        </div>
        <div className="reminder-options">
          <article className="reminder-card reminder-settings-card">
            <label className="select-field">
              <span>{t("reminderMethod")}</span>
              <select value={selectedMethod} onChange={(event) => setSelectedMethod(event.target.value)}>
                {methodOptions.map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </label>
            <label className="select-field">
              <span>Number of Reminders</span>
              <select value={reminderCount} onChange={(event) => setReminderCount(Number(event.target.value))}>
                {[1, 2, 3].map((count) => (
                  <option key={count} value={count}>{count} reminder{count > 1 ? "s" : ""}</option>
                ))}
              </select>
            </label>
          </article>
          <div className="reminder-time-list">
            {reminders.map((reminder, index) => (
              <article className="reminder-card" key={index}>
                <h3>{t("reminderNumber")} {index + 1}</h3>
                <label className="select-field">
                  <span>{t("reminderTime")}</span>
                  <input type="datetime-local" value={reminder.sendAt} onChange={(event) => updateReminderTime(index, event.target.value)} />
                </label>
              </article>
            ))}
          </div>
        </div>
        <div className="preference-box">
          <span>{t("preferences")}</span>
          <strong>{reminderCount} reminder{reminderCount > 1 ? "s" : ""} â€¢ {selectedMethodLabel}</strong>
        </div>
        <button className="primary-action" type="button" disabled={loading} onClick={createAppointment}>{loading ? t("creating") : t("continueConfirmation")}</button>
      </div>
    </section>
  );
}

function PaymentPage({ api, booking, goBack, confirm, t, showNotice }) {
  const [payment, setPayment] = useState({
    method: "orange-money",
    phone: "+237 "
  });
  const [loading, setLoading] = useState(false);
  const amount = booking.paymentAmount || reminderCharge(booking.reminders || []);

  function updatePayment(field, value) {
    setPayment((current) => ({ ...current, [field]: value }));
  }

  async function confirmPayment() {
    const normalizedPhone = payment.phone.replace(/[^\d+]/g, "");
    const localPhone = normalizedPhone.startsWith("+237") ? normalizedPhone.slice(4) : normalizedPhone.startsWith("237") ? normalizedPhone.slice(3) : normalizedPhone;

    if (!/^6\d{8}$/.test(localPhone)) {
      showNotice(t("paymentNotice"));
      return;
    }

    const paidBooking = {
      ...booking,
      payment: {
        method: payment.method,
        phone: `+237${localPhone}`,
        reference: `PAY-${Date.now()}`,
        amount,
        status: "payment-requested"
      }
    };

    if (booking.isDemo) {
      confirm({ ...paidBooking, appointmentId: "HC-DEMO" });
      return;
    }

    setLoading(true);
    try {
      confirm(await submitAppointment(api, paidBooking, booking.reminders || []));
    } catch (error) {
      showNotice(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="page payment-page">
      <header className="white-header">
        <BackButton onClick={goBack} />
        <h1>{t("paymentTitle")}</h1>
        <p>{t("paymentSubtitle")}</p>
      </header>
      <div className="payment-content">
        <SectionLabel icon={<Phone />} title={t("paymentMethod")} />
        <div className="payment-method-grid">
          {[
            ["orange-money", t("orangeMoney")],
            ["mobile-money", t("mobileMoney")]
          ].map(([value, label]) => (
            <button
              className={payment.method === value ? "payment-method active" : "payment-method"}
              key={value}
              type="button"
              onClick={() => updatePayment("method", value)}
            >
              <span>{label}</span>
              {payment.method === value && <Check size={22} />}
            </button>
          ))}
        </div>
        <div className="payment-card">
          <InputField label={t("paymentPhone")} icon={<Phone />} value={payment.phone} onChange={(value) => updatePayment("phone", value)} placeholder="+237 6XXXXXXXX" />
          <p className="payment-instruction">{t("paymentPrompt")}</p>
          <div className="payment-total">
            <span>{t("paymentAmount")}</span>
            <strong>{amount} FRS</strong>
          </div>
          <button className="primary-action" type="button" disabled={loading} onClick={confirmPayment}>{loading ? t("creating") : t("confirmPayment")}</button>
        </div>
      </div>
    </section>
  );
}

function ConfirmationPage({ booking, backHome, t }) {
  const longDate = new Date(`${booking.date}T00:00:00`).toLocaleDateString("en", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric"
  });
  return (
    <section className="page confirmation-page">
      <div className="success-mark"><Check size={70} /></div>
      <h1>{t("confirmed")}</h1>
      <p>{t("confirmedSubtitle")}</p>
      <article className="receipt-card">
        <div className="receipt-doctor">
          <div className="doctor-avatar small">ðŸ‘©â€âš•ï¸</div>
          <div>
            <h2>Dr. {booking.doctor.name}</h2>
            <span>{booking.doctor.specialization || "Doctor"}</span>
          </div>
        </div>
        <div className="receipt-lines">
          <span><CalendarDays size={21} /> {longDate}</span>
          <span><Clock3 size={21} /> {toDisplayTime(booking.startTime)} - {toDisplayTime(booking.endTime)}</span>
          <span><MapPin size={21} /> Regional Hospital Buea</span>
          {booking.previousMedicalReport?.fileName && <span><FileText size={21} /> {booking.previousMedicalReport.fileName}</span>}
        </div>
        {booking.previousMedicalReport?.details && (
          <div className="report-summary">
            <strong>{t("reportDetails")}</strong>
            <span>{t("age")}: {booking.previousMedicalReport.details.age}</span>
            <span>{t("bloodPressure")}: {booking.previousMedicalReport.details.bloodPressure}</span>
            <span>{t("height")}: {booking.previousMedicalReport.details.height}</span>
            <span>{t("temperature")}: {booking.previousMedicalReport.details.temperature}</span>
          </div>
        )}
        <div className="booking-id">
          <span>{t("bookingId")}</span>
          <strong>#{String(booking.appointmentId || "HC2026").slice(-10).toUpperCase()}</strong>
        </div>
      </article>
      <button className="outline-action" type="button"><Download size={22} /> {t("downloadReceipt")}</button>
      <button className="primary-action" type="button" onClick={backHome}>{t("backHome")}</button>
    </section>
  );
}

function AppointmentsPage({ api, user, goBack, showNotice, t }) {
  const [appointments, setAppointments] = useState([]);
  const [cancellingId, setCancellingId] = useState("");
  const [openAppointmentId, setOpenAppointmentId] = useState("");

  function loadAppointments() {
    api.request("/appointments")
      .then((result) => setAppointments(result.data))
      .catch((error) => showNotice(error.message));
  }

  useEffect(() => {
    loadAppointments();
  }, [api, showNotice]);

  async function cancelAppointment(appointmentId) {
    if (!window.confirm(t("cancelConfirm"))) {
      return;
    }

    setCancellingId(appointmentId);
    try {
      const result = await api.request(`/appointments/${appointmentId}`, {
        method: "DELETE"
      });
      showNotice(result.message);
      loadAppointments();
    } catch (error) {
      showNotice(error.message);
    } finally {
      setCancellingId("");
    }
  }

  return (
    <section className="page appointments-page">
      <header className="white-header compact">
        <BackButton onClick={goBack} />
        <h1>{user?.role === "doctor" ? t("doctorSchedule") : t("myAppointments")}</h1>
        <p>{t("appointmentsSubtitle")}</p>
      </header>
      <div className="content-list">
        {user?.role === "patient" && <p className="appointment-rule">{t("cancellationRule")}</p>}
        {appointments.length === 0 && <p className="empty-text">{t("noAppointments")}</p>}
        {appointments.map((appointment) => {
          const canCancel = user?.role === "patient" && canPatientCancelAppointment(appointment);
          const isDoctorView = user?.role === "doctor";
          const report = appointment.previousMedicalReport?.details;
          return (
            <article className="appointment-card" key={appointment._id}>
              <div>
                <h2>{isDoctorView ? appointment.patient?.name || "Client" : `Dr. ${appointment.doctor?.name}`}</h2>
                <p>{appointment.appointmentDate?.slice(0, 10)} â€¢ {appointment.startTime} - {appointment.endTime}</p>
                <span>{appointment.reason || "Consultation"}</span>
                {appointment.previousMedicalReport?.fileName && <span>{t("previousMedicalReport")}: {appointment.previousMedicalReport.fileName}</span>}
                {appointment.previousMedicalReport?.details && (
                  <span>{t("reportDetails")}: {t("age")} {appointment.previousMedicalReport.details.age}, {t("bloodPressure")} {appointment.previousMedicalReport.details.bloodPressure}</span>
                )}
                {isDoctorView && openAppointmentId === appointment._id && (
                  <div className="client-detail-panel">
                    <section>
                      <h3>{t("clientInformation")}</h3>
                      <span>{t("fullName")}: {appointment.patient?.name || "Not provided"}</span>
                      <span>{t("email")}: {appointment.patient?.email || "Not provided"}</span>
                      <span>{t("phoneNumber")}: {appointment.patient?.phone || "Not provided"}</span>
                    </section>
                    <section>
                      <h3>{t("appointmentInformation")}</h3>
                      <span>{t("selectDate")}: {appointment.appointmentDate?.slice(0, 10)}</span>
                      <span>{t("availableSlots")}: {appointment.startTime} - {appointment.endTime}</span>
                      <span>{t("previousMedicalReport")}: {appointment.previousMedicalReport?.fileName || "Structured report only"}</span>
                    </section>
                    {report && (
                      <section className="client-medical-grid">
                        <h3>{t("reportDetails")}</h3>
                        <span>{t("age")}: {report.age}</span>
                        <span>{t("bloodPressure")}: {report.bloodPressure}</span>
                        <span>{t("height")}: {report.height}</span>
                        <span>{t("temperature")}: {report.temperature}</span>
                        <span>{t("pressure")}: {report.pressure}</span>
                        <span>{t("weight")}: {report.weight || "Not provided"}</span>
                        <span>{t("allergies")}: {report.allergies || "None provided"}</span>
                      </section>
                    )}
                  </div>
                )}
                {user?.role === "patient" && !canCancel && appointment.status === "confirmed" && (
                  <small className="cancel-note">{t("cancelWindowClosed")}</small>
                )}
              </div>
              <div className="appointment-actions">
                <strong>{appointment.status}</strong>
                {isDoctorView && (
                  <button
                    className="outline-action compact-action"
                    type="button"
                    onClick={() => setOpenAppointmentId((current) => current === appointment._id ? "" : appointment._id)}
                  >
                    {openAppointmentId === appointment._id ? t("hideClientDetails") : t("viewClientDetails")}
                  </button>
                )}
                {canCancel && (
                  <button
                    className="danger-action"
                    type="button"
                    disabled={cancellingId === appointment._id}
                    onClick={() => cancelAppointment(appointment._id)}
                  >
                    {cancellingId === appointment._id ? t("cancelling") : t("cancelAppointment")}
                  </button>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function DoctorHome({ api, user, signOut, openAppointments, showNotice, t }) {
  const [selectedDays, setSelectedDays] = useState(["1", "3", "5"]);
  const [schedule, setSchedule] = useState({ startTime: "09:00", endTime: "15:00", slotDurationMinutes: "30" });
  const [specialization, setSpecialization] = useState(user?.specialization || "Cardiology");

  async function saveSchedule() {
    if (selectedDays.length === 0) {
      showNotice(t("workingDays"));
      return;
    }

    try {
      const result = await api.request("/doctors/me/schedule", {
        method: "PATCH",
        body: JSON.stringify({
          specialization,
          schedule: selectedDays.map((dayOfWeek) => ({
            ...schedule,
            dayOfWeek: Number(dayOfWeek),
            slotDurationMinutes: Number(schedule.slotDurationMinutes)
          }))
        })
      });
      showNotice(result.message);
    } catch (error) {
      showNotice(error.message);
    }
  }

  function toggleDay(day) {
    setSelectedDays((current) => current.includes(day) ? current.filter((item) => item !== day) : [...current, day]);
  }

  return (
    <section className="page doctor-home">
      <header className="blue-header doctor">
        <div className="header-row">
          <div>
            <h1>{t("doctorDesk")}</h1>
            <p>{t("welcomeDoctor")}, Dr. {user?.name}</p>
          </div>
          <button className="icon-button light" type="button" onClick={signOut}><X size={28} /></button>
        </div>
      </header>
      <div className="doctor-tools">
        <label className="select-field">
          <span>{t("specialty")}</span>
          <select value={specialization} onChange={(event) => setSpecialization(event.target.value)}>
            {DOCTOR_SPECIALTIES.map((specialty) => (
              <option key={specialty} value={specialty}>{specialty}</option>
            ))}
          </select>
        </label>
        <fieldset className="day-picker">
          <legend>{t("workingDays")}</legend>
          {[
            ["1", "Mon"],
            ["2", "Tue"],
            ["3", "Wed"],
            ["4", "Thu"],
            ["5", "Fri"],
            ["6", "Sat"],
            ["0", "Sun"]
          ].map(([value, label]) => (
            <button key={value} type="button" className={selectedDays.includes(value) ? "active" : ""} onClick={() => toggleDay(value)}>
              {label}
            </button>
          ))}
        </fieldset>
        <div className="split-row">
          <InputField label={t("start")} icon={<Clock3 />} value={schedule.startTime} onChange={(value) => setSchedule({ ...schedule, startTime: value })} type="time" />
          <InputField label={t("end")} icon={<Clock3 />} value={schedule.endTime} onChange={(value) => setSchedule({ ...schedule, endTime: value })} type="time" />
        </div>
        <InputField label={t("slotMinutes")} icon={<CalendarDays />} value={schedule.slotDurationMinutes} onChange={(value) => setSchedule({ ...schedule, slotDurationMinutes: value })} type="number" />
        <button className="primary-action" type="button" onClick={saveSchedule}>{t("saveSchedule")}</button>
        <button className="outline-action" type="button" onClick={openAppointments}>{t("viewAppointments")}</button>
      </div>
    </section>
  );
}

function addHalfHour(time) {
  const [hours, minutes] = time.split(":").map(Number);
  const date = new Date();
  date.setHours(hours, minutes + 30, 0, 0);
  return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
}

function toDisplayTime(time) {
  if (!time) return "";
  const [hours, minutes] = time.split(":").map(Number);
  const date = new Date();
  date.setHours(hours, minutes || 0, 0, 0);
  return date.toLocaleTimeString("en", { hour: "2-digit", minute: "2-digit" });
}

createRoot(document.getElementById("root")).render(<App />);

