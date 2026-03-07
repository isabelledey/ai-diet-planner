export type Language = 'en' | 'he' | 'ru'

export type TranslationKey =
  | 'login'
  | 'upload_meal'
  | 'terms'
  | 'go_back'
  | 'history'
  | 'language_label'
  | 'history_meals'
  | 'history_total_calories'
  | 'history_error_loading'
  | 'history_no_meals'
  | 'history_previous_week'
  | 'history_next_week'
  | 'logout'
  | 'accessibility'
  | 'landing_brand'
  | 'landing_title'
  | 'landing_subtitle'
  | 'landing_start'
  | 'landing_badge_ai'
  | 'landing_badge_personalized'
  | 'landing_badge_instant'
  | 'onboarding_step_email'
  | 'onboarding_step_verify'
  | 'onboarding_step_profile'
  | 'email_title'
  | 'email_subtitle'
  | 'full_name'
  | 'email_address'
  | 'name_placeholder'
  | 'email_placeholder'
  | 'terms_agree_prefix'
  | 'terms_agree_link'
  | 'terms_agree_suffix'
  | 'sending_code'
  | 'get_code'
  | 'verify_title'
  | 'verify_subtitle_prefix'
  | 'verify_subtitle_suffix'
  | 'resend_code'
  | 'resend_in'
  | 'back'
  | 'verify'
  | 'profile_about_title'
  | 'profile_about_subtitle'
  | 'gender'
  | 'male'
  | 'female'
  | 'other'
  | 'age'
  | 'age_placeholder'
  | 'height'
  | 'height_placeholder_cm'
  | 'height_placeholder_ft'
  | 'weight'
  | 'weight_placeholder_kg'
  | 'weight_placeholder_lbs'
  | 'continue'
  | 'profile_lifestyle_title'
  | 'profile_lifestyle_subtitle'
  | 'activity_level'
  | 'activity_placeholder'
  | 'activity_sedentary'
  | 'activity_light'
  | 'activity_moderate'
  | 'activity_active'
  | 'activity_very_active'
  | 'food_preferences'
  | 'pref_no_restrictions'
  | 'pref_vegetarian'
  | 'pref_vegan'
  | 'pref_keto'
  | 'pref_paleo'
  | 'pref_gluten_free'
  | 'profile_goal_title'
  | 'profile_goal_subtitle'
  | 'goal_lose_weight'
  | 'goal_lose_weight_desc'
  | 'goal_maintain'
  | 'goal_maintain_desc'
  | 'goal_build_muscle'
  | 'goal_build_muscle_desc'
  | 'goal_get_fit'
  | 'goal_get_fit_desc'
  | 'complete'
  | 'photo_title'
  | 'photo_subtitle'
  | 'capture_dish'
  | 'capture_hint'
  | 'take_photo'
  | 'upload_image'
  | 'analyzing_meal'
  | 'analyze_calories'
  | 'remove_photo'
  | 'aria_take_photo'
  | 'aria_upload_image'
  | 'analysis_found_title'
  | 'analysis_your_meal_alt'
  | 'nutritional_breakdown'
  | 'detected_items'
  | 'reanalyzing'
  | 'analyze_again'
  | 'save_and_get_plan'
  | 'dashboard_greeting'
  | 'macro_protein'
  | 'macro_carbs'
  | 'macro_fat'
  | 'macro_fiber'
  | 'today_meals'
  | 'no_meals_today'
  | 'snap_to_start'
  | 'suggested_meals'
  | 'goal_reached'
  | 'no_suggestions'
  | 'add'
  | 'kcal_remaining'
  | 'kcal_short'
  | 'meal_fallback'
  | 'aria_remove_meal'
  | 'meal_saved'
  | 'profile_created_saved'
  | 'profile_created'
  | 'analysis_failed'
  | 'generic_error'
  | 'no_meal_image'
  | 'toast_meal_added'
  | 'toast_meal_removed'
  | 'undo'
  | 'toast_resend_failed'
  | 'accessibility_title'
  | 'accessibility_intro'
  | 'accessibility_measures_title'
  | 'accessibility_measure_1'
  | 'accessibility_measure_2'
  | 'accessibility_measure_3'
  | 'accessibility_measure_4'
  | 'accessibility_conformance_title'
  | 'accessibility_conformance_text'
  | 'accessibility_feedback_title'
  | 'accessibility_feedback_text'
  | 'terms_title'
  | 'terms_last_updated_label'
  | 'terms_acceptance_title'
  | 'terms_acceptance_text'
  | 'terms_service_title'
  | 'terms_service_text'
  | 'terms_medical_title'
  | 'terms_medical_text'
  | 'terms_data_title'
  | 'terms_data_text'
  | 'terms_liability_title'
  | 'terms_liability_text'
  | 'close'

export const translations: Record<Language, Record<TranslationKey, string>> = {
  en: {
    login: 'Login',
    upload_meal: 'Upload Meal',
    terms: 'Terms of Use',
    go_back: 'Go Back',
    history: 'Your Progress',
    language_label: 'Language',
    history_meals: 'Meals',
    history_total_calories: 'Total Calories',
    history_error_loading: 'Error loading history.',
    history_no_meals: 'No meals recorded for this date.',
    history_previous_week: 'Previous week',
    history_next_week: 'Next week',
    logout: 'Log Out',
    accessibility: 'Accessibility',
    landing_brand: 'NutriSnap',
    landing_title: "Let's check your meal and build a daily plan together",
    landing_subtitle: "Snap a photo of your dish. We'll count the calories and suggest what to eat next.",
    landing_start: "Let's Start",
    landing_badge_ai: 'AI-Powered',
    landing_badge_personalized: 'Personalized Plan',
    landing_badge_instant: 'Instant Results',
    onboarding_step_email: 'Email',
    onboarding_step_verify: 'Verify',
    onboarding_step_profile: 'Profile',
    email_title: "What's your name and email?",
    email_subtitle: "We'll send you a verification code to create your personalized nutrition profile.",
    full_name: 'Full name',
    email_address: 'Email address',
    name_placeholder: 'Jane Doe',
    email_placeholder: 'your@email.com',
    terms_agree_prefix: 'I have read and agree to the',
    terms_agree_link: 'Terms of Use',
    terms_agree_suffix: '.',
    sending_code: 'Sending code...',
    get_code: 'Get Code',
    verify_title: 'Enter verification code',
    verify_subtitle_prefix: "We've sent a 6-digit code to",
    verify_subtitle_suffix: '',
    resend_code: 'Resend code',
    resend_in: 'Resend code in {seconds}s',
    back: 'Back',
    verify: 'Verify',
    profile_about_title: 'About you',
    profile_about_subtitle: "We'll use this to calculate your daily calorie needs.",
    gender: 'Gender',
    male: 'Male',
    female: 'Female',
    other: 'Other',
    age: 'Age',
    age_placeholder: '25',
    height: 'Height',
    height_placeholder_cm: '175',
    height_placeholder_ft: '5.9',
    weight: 'Weight',
    weight_placeholder_kg: '70',
    weight_placeholder_lbs: '154',
    continue: 'Continue',
    profile_lifestyle_title: 'Your lifestyle',
    profile_lifestyle_subtitle: 'Help us understand your activity level and food preferences.',
    activity_level: 'Activity Level',
    activity_placeholder: 'Select activity level',
    activity_sedentary: 'Sedentary (little exercise)',
    activity_light: 'Lightly Active (1-3 days/week)',
    activity_moderate: 'Moderately Active (3-5 days/week)',
    activity_active: 'Active (6-7 days/week)',
    activity_very_active: 'Very Active (intense daily)',
    food_preferences: 'Food Preferences',
    pref_no_restrictions: 'No Restrictions',
    pref_vegetarian: 'Vegetarian',
    pref_vegan: 'Vegan',
    pref_keto: 'Keto',
    pref_paleo: 'Paleo',
    pref_gluten_free: 'Gluten-Free',
    profile_goal_title: "What's your goal?",
    profile_goal_subtitle: "We'll tailor your calorie targets and meal suggestions accordingly.",
    goal_lose_weight: 'Lose Weight',
    goal_lose_weight_desc: 'Calorie deficit',
    goal_maintain: 'Maintain',
    goal_maintain_desc: 'Stay balanced',
    goal_build_muscle: 'Build Muscle',
    goal_build_muscle_desc: 'Calorie surplus',
    goal_get_fit: 'Get Fit',
    goal_get_fit_desc: 'Active lifestyle',
    complete: 'Complete',
    photo_title: 'Snap Your Meal',
    photo_subtitle: 'Take a photo or upload an image',
    capture_dish: 'Capture your dish',
    capture_hint: 'Take a photo or drag an image here',
    take_photo: 'Take Photo',
    upload_image: 'Upload Image',
    analyzing_meal: 'Analyzing your meal...',
    analyze_calories: 'Analyze Calories',
    remove_photo: 'Remove photo',
    aria_take_photo: 'Take a photo',
    aria_upload_image: 'Upload an image',
    analysis_found_title: "Here's what we found in your meal",
    analysis_your_meal_alt: 'Your meal',
    nutritional_breakdown: 'Nutritional Breakdown',
    detected_items: 'Detected Items',
    reanalyzing: 'Re-analyzing...',
    analyze_again: 'Analyze Again',
    save_and_get_plan: 'Save & Get My Plan',
    dashboard_greeting: 'Hi',
    macro_protein: 'Protein',
    macro_carbs: 'Carbs',
    macro_fat: 'Fat',
    macro_fiber: 'Fiber',
    today_meals: "Today's Meals",
    no_meals_today: 'No meals logged yet today',
    snap_to_start: 'Snap a photo to get started!',
    suggested_meals: 'Suggested Next Meals',
    goal_reached: "You've reached your calorie goal for today!",
    no_suggestions: 'No suggestions available right now.',
    add: 'Add',
    kcal_remaining: 'kcal remaining',
    kcal_short: 'kcal',
    meal_fallback: 'Meal {index}',
    aria_remove_meal: 'Remove {meal}',
    meal_saved: 'Meal saved to your daily log!',
    profile_created_saved: 'Profile created and meal saved!',
    profile_created: 'Profile created! Start tracking your meals.',
    analysis_failed: 'Failed to analyze your meal. Please try again.',
    generic_error: 'Something went wrong. Please try again.',
    no_meal_image: 'No meal image found. Please upload the photo again.',
    toast_meal_added: '{meal} added to your log!',
    toast_meal_removed: 'Meal removed from your log.',
    undo: 'Undo',
    toast_resend_failed: 'Failed to resend code',
    accessibility_title: 'Accessibility Statement',
    accessibility_intro: 'NutriSnap is committed to ensuring digital accessibility for people with disabilities. We are continually improving the user experience for everyone and applying the relevant accessibility standards.',
    accessibility_measures_title: 'Measures to support accessibility',
    accessibility_measure_1: 'Integrating accessibility into our development practices.',
    accessibility_measure_2: 'Ensuring all interface elements have appropriate ARIA labels for screen readers.',
    accessibility_measure_3: 'Designing with high color contrast for readability.',
    accessibility_measure_4: 'Allowing full keyboard navigation.',
    accessibility_conformance_title: 'Conformance status',
    accessibility_conformance_text: 'NutriSnap is partially conformant with WCAG 2.1 level AA. Partially conformant means that some parts of the content may not yet fully conform to the accessibility standard.',
    accessibility_feedback_title: 'Feedback',
    accessibility_feedback_text: 'We welcome your feedback on the accessibility of NutriSnap. Please let us know if you encounter accessibility barriers on the platform by emailing: [Your Email].',
    terms_title: 'Terms of Use',
    terms_last_updated_label: 'Last Updated:',
    terms_acceptance_title: '1. Acceptance of Terms',
    terms_acceptance_text: 'By accessing and using NutriSnap ("the Service"), you accept and agree to be bound by the terms and provision of this agreement.',
    terms_service_title: '2. Description of Service',
    terms_service_text: 'NutriSnap provides AI-powered meal analysis and nutritional tracking. The dietary information, macronutrient breakdowns, and health tracking features provided by the Service are generated by artificial intelligence and are for informational and educational purposes only.',
    terms_medical_title: '3. Medical Disclaimer',
    terms_medical_text: 'NutriSnap is not a medical application. The information provided by the Service is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician, a registered dietitian, or other health provider with any questions you may have regarding a medical condition or dietary restrictions.',
    terms_data_title: '4. User Accounts and Data',
    terms_data_text: 'To use certain features, you must create an account. You are responsible for maintaining the confidentiality of your account information. By uploading images of meals to the Service, you grant NutriSnap permission to process these images through third-party AI services solely for the purpose of providing nutritional analysis.',
    terms_liability_title: '5. Limitation of Liability',
    terms_liability_text: 'The Service is provided on an "AS IS" and "AS AVAILABLE" basis. As a developer project, we make no guarantees regarding the continuous availability or absolute accuracy of the AI-generated nutritional data. In no event shall NutriSnap, its developer, or affiliates be liable for any indirect, incidental, special, or consequential damages arising from the use of the Service.',
    close: 'Close',
  },
  he: {
    login: 'התחברות',
    upload_meal: 'העלאת ארוחה',
    terms: 'תנאי שימוש',
    go_back: 'חזרה',
    history: 'ההתקדמות שלך',
    language_label: 'שפה',
    history_meals: 'ארוחות',
    history_total_calories: 'סה״כ קלוריות',
    history_error_loading: 'שגיאה בטעינת היסטוריה.',
    history_no_meals: 'לא נרשמו ארוחות לתאריך זה.',
    history_previous_week: 'שבוע קודם',
    history_next_week: 'שבוע הבא',
    logout: 'התנתקות',
    accessibility: 'נגישות',
    landing_brand: 'נוטרי-סנאפ',
    landing_title: 'בואו נבדוק את הארוחה שלך ונבנה תוכנית יומית יחד',
    landing_subtitle: 'צלמו את המנה שלכם. נספור את הקלוריות ונציע מה לאכול בהמשך.',
    landing_start: 'בואו נתחיל',
    landing_badge_ai: 'מופעל ב-AI',
    landing_badge_personalized: 'תוכנית אישית',
    landing_badge_instant: 'תוצאות מיידיות',
    onboarding_step_email: 'אימייל',
    onboarding_step_verify: 'אימות',
    onboarding_step_profile: 'פרופיל',
    email_title: 'מה השם והאימייל שלך?',
    email_subtitle: 'נשלח לך קוד אימות כדי ליצור פרופיל תזונה מותאם אישית.',
    full_name: 'שם מלא',
    email_address: 'כתובת אימייל',
    name_placeholder: 'ישראל ישראלי',
    email_placeholder: 'your@email.com',
    terms_agree_prefix: 'קראתי ואני מסכים/ה ל',
    terms_agree_link: 'תנאי השימוש',
    terms_agree_suffix: '.',
    sending_code: 'שולח קוד...',
    get_code: 'קבל קוד',
    verify_title: 'הזן קוד אימות',
    verify_subtitle_prefix: 'שלחנו קוד בן 6 ספרות אל',
    verify_subtitle_suffix: '',
    resend_code: 'שלח קוד מחדש',
    resend_in: 'שליחה מחדש בעוד {seconds} שנ׳',
    back: 'חזרה',
    verify: 'אימות',
    profile_about_title: 'קצת עליך',
    profile_about_subtitle: 'נשתמש בזה כדי לחשב את יעד הקלוריות היומי שלך.',
    gender: 'מגדר',
    male: 'זכר',
    female: 'נקבה',
    other: 'אחר',
    age: 'גיל',
    age_placeholder: '25',
    height: 'גובה',
    height_placeholder_cm: '175',
    height_placeholder_ft: '5.9',
    weight: 'משקל',
    weight_placeholder_kg: '70',
    weight_placeholder_lbs: '154',
    continue: 'המשך',
    profile_lifestyle_title: 'סגנון החיים שלך',
    profile_lifestyle_subtitle: 'עזור לנו להבין את רמת הפעילות והעדפות המזון שלך.',
    activity_level: 'רמת פעילות',
    activity_placeholder: 'בחר רמת פעילות',
    activity_sedentary: 'יושבני (מעט פעילות)',
    activity_light: 'פעילות קלה (1-3 ימים/שבוע)',
    activity_moderate: 'פעילות בינונית (3-5 ימים/שבוע)',
    activity_active: 'פעיל/ה (6-7 ימים/שבוע)',
    activity_very_active: 'מאוד פעיל/ה (אינטנסיבי יומי)',
    food_preferences: 'העדפות מזון',
    pref_no_restrictions: 'ללא הגבלות',
    pref_vegetarian: 'צמחוני',
    pref_vegan: 'טבעוני',
    pref_keto: 'קטו',
    pref_paleo: 'פליאו',
    pref_gluten_free: 'ללא גלוטן',
    profile_goal_title: 'מה המטרה שלך?',
    profile_goal_subtitle: 'נתאים את יעדי הקלוריות וההמלצות בהתאם.',
    goal_lose_weight: 'ירידה במשקל',
    goal_lose_weight_desc: 'גרעון קלורי',
    goal_maintain: 'שמירה',
    goal_maintain_desc: 'איזון',
    goal_build_muscle: 'בניית שריר',
    goal_build_muscle_desc: 'עודף קלורי',
    goal_get_fit: 'להיכנס לכושר',
    goal_get_fit_desc: 'אורח חיים פעיל',
    complete: 'סיום',
    photo_title: 'צלם את הארוחה שלך',
    photo_subtitle: 'צלם או העלה תמונה',
    capture_dish: 'צלם את המנה',
    capture_hint: 'צלם תמונה או גרור לכאן',
    take_photo: 'צלם תמונה',
    upload_image: 'העלה תמונה',
    analyzing_meal: 'מנתח את הארוחה...',
    analyze_calories: 'נתח קלוריות',
    remove_photo: 'הסר תמונה',
    aria_take_photo: 'צלם תמונה',
    aria_upload_image: 'העלה תמונה',
    analysis_found_title: 'כך זיהינו את הארוחה שלך',
    analysis_your_meal_alt: 'הארוחה שלך',
    nutritional_breakdown: 'פירוט תזונתי',
    detected_items: 'פריטים שזוהו',
    reanalyzing: 'מנתח מחדש...',
    analyze_again: 'נתח שוב',
    save_and_get_plan: 'שמור וקבל תוכנית',
    dashboard_greeting: 'היי',
    macro_protein: 'חלבון',
    macro_carbs: 'פחמימות',
    macro_fat: 'שומן',
    macro_fiber: 'סיבים',
    today_meals: 'ארוחות היום',
    no_meals_today: 'עדיין לא נוספו ארוחות היום',
    snap_to_start: 'צלם תמונה כדי להתחיל!',
    suggested_meals: 'ארוחות מומלצות להמשך',
    goal_reached: 'הגעת ליעד הקלוריות להיום!',
    no_suggestions: 'אין כרגע המלצות.',
    add: 'הוסף',
    kcal_remaining: 'קלוריות שנותרו',
    kcal_short: 'קל׳',
    meal_fallback: 'ארוחה {index}',
    aria_remove_meal: 'הסר {meal}',
    meal_saved: 'הארוחה נשמרה ביומן היומי!',
    profile_created_saved: 'הפרופיל נוצר והארוחה נשמרה!',
    profile_created: 'הפרופיל נוצר! אפשר להתחיל לעקוב אחרי ארוחות.',
    analysis_failed: 'ניתוח הארוחה נכשל. נסה/י שוב.',
    generic_error: 'משהו השתבש. נסה/י שוב.',
    no_meal_image: 'לא נמצאה תמונת ארוחה. אנא העלה/י מחדש.',
    toast_meal_added: '{meal} נוסף/ה ליומן!',
    toast_meal_removed: 'הארוחה הוסרה מהיומן.',
    undo: 'בטל',
    toast_resend_failed: 'שליחה מחדש נכשלה',
    accessibility_title: 'הצהרת נגישות',
    accessibility_intro: 'NutriSnap מחויבת להנגשה דיגיטלית לאנשים עם מוגבלויות. אנו ממשיכים לשפר את חוויית המשתמש וליישם תקני נגישות רלוונטיים.',
    accessibility_measures_title: 'צעדים לתמיכה בנגישות',
    accessibility_measure_1: 'שילוב נגישות בתהליכי הפיתוח שלנו.',
    accessibility_measure_2: 'הבטחת תוויות ARIA מתאימות לכל רכיבי הממשק.',
    accessibility_measure_3: 'עיצוב עם ניגודיות גבוהה לקריאות טובה.',
    accessibility_measure_4: 'אפשרות ניווט מלאה במקלדת.',
    accessibility_conformance_title: 'סטטוס התאמה',
    accessibility_conformance_text: 'NutriSnap עומדת חלקית בתקן WCAG 2.1 ברמה AA. התאמה חלקית משמעותה שחלק מהתוכן עדיין אינו עומד באופן מלא בתקן.',
    accessibility_feedback_title: 'משוב',
    accessibility_feedback_text: 'נשמח לקבל משוב לגבי הנגישות ב-NutriSnap. אם נתקלת בחסמי נגישות, ניתן לפנות אלינו במייל: [Your Email].',
    terms_title: 'תנאי שימוש',
    terms_last_updated_label: 'עודכן לאחרונה:',
    terms_acceptance_title: '1. קבלת התנאים',
    terms_acceptance_text: 'בשימוש ב-NutriSnap ("השירות"), את/ה מקבל/ת ומסכים/ה להיות כפוף/ה לתנאים אלה.',
    terms_service_title: '2. תיאור השירות',
    terms_service_text: 'NutriSnap מספקת ניתוח ארוחות ומעקב תזונתי מבוססי AI. המידע התזונתי מיועד למטרות מידע וחינוך בלבד.',
    terms_medical_title: '3. כתב ויתור רפואי',
    terms_medical_text: 'NutriSnap אינה אפליקציה רפואית. המידע אינו תחליף לייעוץ, אבחון או טיפול רפואי מקצועי.',
    terms_data_title: '4. חשבונות משתמש ונתונים',
    terms_data_text: 'לשימוש בתכונות מסוימות יש ליצור חשבון. בהעלאת תמונות, את/ה מאשר/ת עיבודן לצורך ניתוח תזונתי.',
    terms_liability_title: '5. הגבלת אחריות',
    terms_liability_text: 'השירות ניתן "כמות שהוא" ו"כפי שזמין". איננו מתחייבים לדיוק מלא או זמינות רציפה.',
    close: 'סגור',
  },
  ru: {
    login: 'Вход',
    upload_meal: 'Загрузить блюдо',
    terms: 'Условия использования',
    go_back: 'Назад',
    history: 'Ваш прогресс',
    language_label: 'Язык',
    history_meals: 'Блюда',
    history_total_calories: 'Всего калорий',
    history_error_loading: 'Ошибка загрузки истории.',
    history_no_meals: 'За эту дату нет записанных блюд.',
    history_previous_week: 'Предыдущая неделя',
    history_next_week: 'Следующая неделя',
    logout: 'Выйти',
    accessibility: 'Доступность',
    landing_brand: 'NutriSnap',
    landing_title: 'Давайте проверим ваше блюдо и составим план на день',
    landing_subtitle: 'Сфотографируйте блюдо. Мы посчитаем калории и подскажем, что съесть дальше.',
    landing_start: 'Начать',
    landing_badge_ai: 'На базе ИИ',
    landing_badge_personalized: 'Персональный план',
    landing_badge_instant: 'Мгновенный результат',
    onboarding_step_email: 'Email',
    onboarding_step_verify: 'Проверка',
    onboarding_step_profile: 'Профиль',
    email_title: 'Как вас зовут и какой у вас email?',
    email_subtitle: 'Мы отправим код подтверждения для создания персонального профиля питания.',
    full_name: 'Полное имя',
    email_address: 'Email',
    name_placeholder: 'Иван Иванов',
    email_placeholder: 'your@email.com',
    terms_agree_prefix: 'Я прочитал(а) и согласен(на) с',
    terms_agree_link: 'Условиями использования',
    terms_agree_suffix: '.',
    sending_code: 'Отправка кода...',
    get_code: 'Получить код',
    verify_title: 'Введите код подтверждения',
    verify_subtitle_prefix: 'Мы отправили 6-значный код на',
    verify_subtitle_suffix: '',
    resend_code: 'Отправить код снова',
    resend_in: 'Повторная отправка через {seconds}с',
    back: 'Назад',
    verify: 'Подтвердить',
    profile_about_title: 'О вас',
    profile_about_subtitle: 'Мы используем эти данные для расчета дневной нормы калорий.',
    gender: 'Пол',
    male: 'Мужской',
    female: 'Женский',
    other: 'Другое',
    age: 'Возраст',
    age_placeholder: '25',
    height: 'Рост',
    height_placeholder_cm: '175',
    height_placeholder_ft: '5.9',
    weight: 'Вес',
    weight_placeholder_kg: '70',
    weight_placeholder_lbs: '154',
    continue: 'Продолжить',
    profile_lifestyle_title: 'Ваш образ жизни',
    profile_lifestyle_subtitle: 'Помогите нам понять ваш уровень активности и пищевые предпочтения.',
    activity_level: 'Уровень активности',
    activity_placeholder: 'Выберите уровень активности',
    activity_sedentary: 'Малоподвижный (минимум упражнений)',
    activity_light: 'Легкая активность (1-3 дня/нед)',
    activity_moderate: 'Средняя активность (3-5 дней/нед)',
    activity_active: 'Активный (6-7 дней/нед)',
    activity_very_active: 'Очень активный (интенсивно ежедневно)',
    food_preferences: 'Пищевые предпочтения',
    pref_no_restrictions: 'Без ограничений',
    pref_vegetarian: 'Вегетарианство',
    pref_vegan: 'Веганство',
    pref_keto: 'Кето',
    pref_paleo: 'Палео',
    pref_gluten_free: 'Без глютена',
    profile_goal_title: 'Какая у вас цель?',
    profile_goal_subtitle: 'Мы настроим цели по калориям и рекомендации под вас.',
    goal_lose_weight: 'Снижение веса',
    goal_lose_weight_desc: 'Дефицит калорий',
    goal_maintain: 'Поддержание',
    goal_maintain_desc: 'Сбалансировано',
    goal_build_muscle: 'Набор мышц',
    goal_build_muscle_desc: 'Профицит калорий',
    goal_get_fit: 'Быть в форме',
    goal_get_fit_desc: 'Активный образ жизни',
    complete: 'Завершить',
    photo_title: 'Сфотографируйте блюдо',
    photo_subtitle: 'Сделайте фото или загрузите изображение',
    capture_dish: 'Сфотографируйте блюдо',
    capture_hint: 'Сделайте фото или перетащите изображение сюда',
    take_photo: 'Сделать фото',
    upload_image: 'Загрузить изображение',
    analyzing_meal: 'Анализируем ваше блюдо...',
    analyze_calories: 'Анализ калорий',
    remove_photo: 'Удалить фото',
    aria_take_photo: 'Сделать фото',
    aria_upload_image: 'Загрузить изображение',
    analysis_found_title: 'Вот что мы нашли в вашем блюде',
    analysis_your_meal_alt: 'Ваше блюдо',
    nutritional_breakdown: 'Пищевая ценность',
    detected_items: 'Обнаруженные ингредиенты',
    reanalyzing: 'Повторный анализ...',
    analyze_again: 'Проанализировать снова',
    save_and_get_plan: 'Сохранить и получить план',
    dashboard_greeting: 'Привет',
    macro_protein: 'Белки',
    macro_carbs: 'Углеводы',
    macro_fat: 'Жиры',
    macro_fiber: 'Клетчатка',
    today_meals: 'Блюда за сегодня',
    no_meals_today: 'Сегодня пока нет записанных блюд',
    snap_to_start: 'Сфотографируйте блюдо, чтобы начать!',
    suggested_meals: 'Рекомендованные блюда',
    goal_reached: 'Вы достигли дневной цели по калориям!',
    no_suggestions: 'Сейчас нет доступных рекомендаций.',
    add: 'Добавить',
    kcal_remaining: 'ккал осталось',
    kcal_short: 'ккал',
    meal_fallback: 'Прием пищи {index}',
    aria_remove_meal: 'Удалить {meal}',
    meal_saved: 'Блюдо сохранено в дневной журнал!',
    profile_created_saved: 'Профиль создан, блюдо сохранено!',
    profile_created: 'Профиль создан! Начинайте отслеживать питание.',
    analysis_failed: 'Не удалось проанализировать блюдо. Попробуйте снова.',
    generic_error: 'Что-то пошло не так. Попробуйте снова.',
    no_meal_image: 'Изображение блюда не найдено. Загрузите фото снова.',
    toast_meal_added: '{meal} добавлено в журнал!',
    toast_meal_removed: 'Блюдо удалено из журнала.',
    undo: 'Отменить',
    toast_resend_failed: 'Не удалось повторно отправить код',
    accessibility_title: 'Заявление о доступности',
    accessibility_intro: 'NutriSnap стремится обеспечить цифровую доступность для людей с инвалидностью. Мы постоянно улучшаем пользовательский опыт и применяем соответствующие стандарты доступности.',
    accessibility_measures_title: 'Меры по обеспечению доступности',
    accessibility_measure_1: 'Интеграция доступности в процесс разработки.',
    accessibility_measure_2: 'Наличие корректных ARIA-меток для элементов интерфейса.',
    accessibility_measure_3: 'Высокий цветовой контраст для читаемости.',
    accessibility_measure_4: 'Полная навигация с клавиатуры.',
    accessibility_conformance_title: 'Статус соответствия',
    accessibility_conformance_text: 'NutriSnap частично соответствует WCAG 2.1 уровня AA.',
    accessibility_feedback_title: 'Обратная связь',
    accessibility_feedback_text: 'Мы приветствуем отзывы о доступности NutriSnap. Если вы столкнулись с барьерами доступности, напишите нам: [Your Email].',
    terms_title: 'Условия использования',
    terms_last_updated_label: 'Последнее обновление:',
    terms_acceptance_title: '1. Принятие условий',
    terms_acceptance_text: 'Используя NutriSnap ("Сервис"), вы принимаете условия настоящего соглашения.',
    terms_service_title: '2. Описание сервиса',
    terms_service_text: 'NutriSnap предоставляет ИИ-анализ блюд и трекинг питания. Информация носит ознакомительный характер.',
    terms_medical_title: '3. Медицинский отказ от ответственности',
    terms_medical_text: 'NutriSnap не является медицинским приложением и не заменяет консультацию специалиста.',
    terms_data_title: '4. Аккаунт и данные',
    terms_data_text: 'Для некоторых функций нужен аккаунт. Загружая фото, вы разрешаете их обработку для анализа питания.',
    terms_liability_title: '5. Ограничение ответственности',
    terms_liability_text: 'Сервис предоставляется "как есть". Мы не гарантируем абсолютную точность ИИ-данных.',
    close: 'Закрыть',
  },
}
