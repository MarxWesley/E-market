export const formatDateTime = (date) => {
    if (!date) return '-';
    return new Intl.DateTimeFormat('pt-BR', {
        dateStyle: "short",
        timeStyle: "medium",
    }).format(new Date(date)).replace(',', '');
};