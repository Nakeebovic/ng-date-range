import { DateRangeTranslations } from "./date-range.types";

export const translations: Record<'en' | 'ar', DateRangeTranslations> = {
    ar: {
        fromDate: 'من التاريخ',
        toDate: 'إلى التاريخ',
        from: 'من',
        to: 'إلى',
        apply: 'تطبيق',
        clear: 'مسح',
        months: [
            'يناير', 'فبراير', 'مارس', 'إبريل', 'مايو', 'يونيو',
            'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
        ],
        weekDays: ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت']
    },
    en: {
        fromDate: 'From Date',
        toDate: 'To Date',
        from: 'From',
        to: 'To',
        apply: 'Apply',
        clear: 'Clear',
        months: [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ],
        weekDays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    }
};