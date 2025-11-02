import { useState } from "react";
import TransactionModal from "../TransactionModal";
import { Button } from "../ui/button";

export default function TransactionModalExample() {
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-background p-4">
      <Button onClick={() => setOpen(true)}>Abrir Modal</Button>
      <TransactionModal
        open={open}
        onClose={() => setOpen(false)}
        onSave={(transaction) => {
          console.log('Transação salva:', transaction);
          setOpen(false);
        }}
      />
    </div>
  );
}
