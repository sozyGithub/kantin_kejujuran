import { useState } from "react";
import { Modal, Button, Group, Divider } from "@mantine/core";
const ModalConfirmPayment = (props: any) => {
  const [opened, setOpened] = useState(false);
  return (
    <>
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title="Konfirmasi Pembayaran"
        centered
      >
        <div>
          <p className="font-semibold">Berikut detail pembayaran Anda:</p>
          <Divider my="sm" />
          <p>Total Belanja: Rp{props.totalShopping}</p>
          <p>
            Input:{" "}
            <span className="font-bold text-indigo-500">Rp{props.input}</span>
          </p>
          <div className="flex justify-end space-x-1">
            <Button
              onClick={() => {
                setOpened(false);
              }}
              variant="light"
              color="pink"
            >
              Batal
            </Button>
            <Button
              onClick={() => {
                props.handleConfirmPayment();
                setOpened(false);
              }}
              variant="light"
            >
              Konfirmasi
            </Button>
          </div>
        </div>
      </Modal>

      <Button
        onClick={() => {
          setOpened(true);
        }}
        disabled={+props.input.split(".").join("") >= 0 ? false : true}
        variant="light"
      >
        Bayar
      </Button>
    </>
  );
};

export default ModalConfirmPayment;
