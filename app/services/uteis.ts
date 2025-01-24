export function converterMinutosEmHora(minutos: number) {
    const horas = Math.floor(minutos / 60);
    const min = minutos % 60;
    return `${horas}h${min}m`;
}