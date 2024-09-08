import React, { useState, useEffect } from 'react';

interface Card {
  id: number;
  name: string;
  quantity: number;
  price: number;
  expanded: boolean;
}

const App = () => {
  const [cards, setCards] = useState < Card[] > (JSON.parse(localStorage.getItem('cards') || '[]'));
  const [newCard, setNewCard] = useState < Card > ({ id: 0, name: '', quantity: 0, price: 0, expanded: false });
  const [editing, setEditing] = useState(false);
  const [selectedCard, setSelectedCard] = useState < Card | null > (null);
  const [allExpanded, setAllExpanded] = useState(false);

  useEffect(() => {
    localStorage.setItem('cards', JSON.stringify(cards));
  }, [cards]);

  const handleAddCard = () => {
    setCards([...cards, { ...newCard, id: cards.length + 1, expanded: false }]);
    setNewCard({ id: 0, name: '', quantity: 0, price: 0, expanded: false });
  };

  const handleEditCard = (card: Card) => {
    setEditing(true);
    setSelectedCard(card);
  };

  const handleUpdateCard = () => {
    if (selectedCard) {
      const updatedCards = cards.map((card) => (card.id === selectedCard.id ? selectedCard : card));
      setCards(updatedCards);
      setEditing(false);
      setSelectedCard(null);
    }
  };

  const handleDeleteCard = (card: Card) => {
    const filteredCards = cards.filter((c) => c.id !== card.id);
    setCards(filteredCards);
  };

  const handleTotal = () => {
    return cards.reduce((acc, card) => acc + card.price * card.quantity, 0).toFixed(0);
  };

  const handlePercentage = (price: number) => {
    const total = handleTotal();
    return total ? ((price / total) * 100).toFixed(2) : '0';
  };

  const handleExpandCard = (card: Card) => {
    const updatedCards = cards.map((c) => (c.id === card.id ? { ...c, expanded: !c.expanded } : c));
    setCards(updatedCards);
  };

  const handleExpandAll = () => {
    if (allExpanded) {
      const updatedCards = cards.map((card) => ({ ...card, expanded: false }));
      setCards(updatedCards);
      setAllExpanded(false);
    } else {
      const updatedCards = cards.map((card) => ({ ...card, expanded: true }));
      setCards(updatedCards);
      setAllExpanded(true);
    }
  };

  useEffect(() => {
    const areAllExpanded = cards.every((card) => card.expanded);
    setAllExpanded(areAllExpanded);
  }, [cards]);

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Control de Gastos</h1>

      <div className="sticky top-0 bg-white mb-4 z-10">
        <div className="flex justify-center">
          <input
            type="text"
            value={newCard.name}
            onChange={(e) => setNewCard({ ...newCard, name: e.target.value })}
            placeholder="Producto"
            className="w-full md:w-1/2 xl:w-1/3 p-2 pl-2 text-sm text-white bg-black"
          />
          <input
            type="number"
            step="0.01"
            value={newCard.quantity === 0 ? '' : newCard.quantity}
            onChange={(e) => setNewCard({ ...newCard, quantity: parseFloat(e.target.value) })}
            placeholder="Cantidad"
            className="w-full md:w-1/2 xl:w-1/3 p-2 pl-2 text-sm text-white bg-black border-l border-r border-white"
          />
          <input
            type="number"
            step="0.01"
            value={newCard.price === 0 ? '' : newCard.price}
            onChange={(e) => setNewCard({ ...newCard, price: parseFloat(e.target.value) })}
            placeholder="Precio"
            className="w-full md:w-1/2 xl:w-1/3 p-2 pl-2 text-sm text-white bg-black"
          />
          <button
            onClick={handleAddCard}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4"
          >
            Agregar
          </button>
        </div>

        {editing && selectedCard && (
          <div className="flex justify-center mt-4">
            <input
              type="text"
              value={selectedCard.name}
              onChange={(e) => setSelectedCard({ ...selectedCard, name: e.target.value })}
              placeholder="Producto"
              className="w-full md:w-1/2 xl:w-1/3 p-2 pl-2 text-sm text-white bg-black"
            />
            <input
              type="number"
              step="0.01"
              value={selectedCard.quantity === 0 ? '' : selectedCard.quantity}
              onChange={(e) =>
                setSelectedCard({ ...selectedCard, quantity: parseFloat(e.target.value) })
              }
              placeholder="Cantidad"
              className="w-full md:w-1/2 xl:w-1/3 p-2 pl-2 text-sm text-white bg-black border-l border-r border-white"
            />
            <input
              type="number"
              step="0.01"
              value={selectedCard.price === 0 ? '' : selectedCard.price}
              onChange={(e) => setSelectedCard({ ...selectedCard, price: parseFloat(e.target.value) })}
              placeholder="Precio"
              className="w-full md:w-1/2 xl:w-1/3 p-2 pl-2 text-sm text-white bg-black"
            />
            <button
              onClick={handleUpdateCard}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4"
            >
              Actualizar
            </button>
          </div>
        )}
      </div>

      <div className="flex flex-row justify-start flex-wrap">
        <button
          onClick={handleExpandAll}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 w-full mb-4"
        >
          {allExpanded ? 'Comprimir todos' : 'Expandir todos'}
        </button>
        {cards.map((card) => (
          <div
            key={card.id}
            className={`w-full p-4 m-4 bg-white rounded shadow-md transition-all duration-500 ${card.expanded ? 'h-auto' : 'h-12'
              }`}
          >
            <div
              className="flex flex-row justify-between items-center cursor-pointer"
              onClick={() => handleExpandCard(card)}
            >
              <h2 className="text-lg font-bold">{card.name}</h2>
              <button
                className={`text-lg font-bold ${card.expanded ? 'mb-4' : ''} transition-all duration-500`}
              >
                {card.expanded ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 15l7-7 7 7"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                )}
              </button>
            </div>

            {card.expanded && (
              <div>
                <div className="bg-black text-white flex flex-row justify-between space-x-2 mb-2 p-2 rounded">
                  <p>Cantidad: <br /> {card.quantity === 0 ? 'Cantidad' : card.quantity} kg/u</p>
                  <p>Precio: <br /> ${card.price === 0 ? 'Precio' : card.price}</p>
                  <p>Total: <br /> ${Math.floor(card.price * card.quantity)}</p>
                </div>

                <div className="flex flex-row justify-between">
                  <button
                    onClick={() => handleEditCard(card)}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-1/2"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDeleteCard(card)}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded w-1/2"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="fixed bottom-0 right-0 p-4 bg-white z-10">
        <p className="text-lg font-bold">Total: ${handleTotal()}</p>
      </div>
    </div>
  );
};

export default App;