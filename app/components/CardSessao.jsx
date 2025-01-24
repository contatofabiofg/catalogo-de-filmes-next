export function CardSessao({ titulo, children }) {
  return (
    <div className="cardSessao">
      <div className="absolute -top-[15px] left-[20px] bg-yellow-500 px-6">
        <h2 className="uppercase text-black">{titulo}</h2>
      </div>

      <div className="text-justify lg:text-left">{children}</div>
    </div>
  );
}
