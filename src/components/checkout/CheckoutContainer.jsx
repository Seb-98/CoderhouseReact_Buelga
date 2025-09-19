import { useState, useContext } from "react";
import { Form, Row, Container, Col } from "react-bootstrap";
import { CartContext } from "../../context/CartContext";
import { endCheckout, validateClient, updateStock } from "../../service/checkoutService";
import SectionCartCheckout from "./SectionCartCheckout";
import SectionConfirmCheckout from "./SectionConfirmCheckout";
import InputsCheckout from "./InputsCheckout";
import { useForm } from "react-hook-form";
import Swal from 'sweetalert2';
import SuccessCheckout from "./SuccessCheckout";
import { useNavigate } from "react-router-dom";

const CheckoutContainer = () => {
    const { register, handleSubmit, formState: { errors } } = useForm()
    const navigate = useNavigate();
    const [idTransaction, setIdTransaction] = useState(null)
    const { cart, resumeCart, clearCart, cartSummary } = useContext(CartContext)

    const startCheckout = async (data) => {

        Swal.fire({
            title: "Procesando compra...",
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        const resultValidateClient = await validateClient(data);

        if (!resultValidateClient) {
            Swal.close();
            Swal.fire({
                icon: "error",
                title: "Hubo un problema al validar el cliente",
                confirmButtonText: "OK"
            });
            return;
        }

        const validateEndCheckout = await endCheckout(resumeCart(), cartSummary.totalPay, resultValidateClient.id)

        if (!validateEndCheckout) {
            Swal.close();
            Swal.fire({
                icon: "error",
                title: "Hubo un problema al realizar la compra",
                text: "YPor favor intente de nuevo mas tarde",
            });
            return;
        }
        else {
            await updateStock(resumeCart());
            clearCart();
            Swal.close();
            setIdTransaction(validateEndCheckout.id)
        }
    }

    const handleDeleteCart = () => {
        Swal.fire({
            title: "Seguro desea vaciar el carrito?",
            showCancelButton: true,
            confirmButtonText: "Eliminar",
        }).then((result) => {
            if (result.isConfirmed) {
                clearCart();
                navigate("/");
            }
        });
    };

    return (
        <>
            {idTransaction ?
                <SuccessCheckout idTransaction={idTransaction} />
                :
                <Container>
                    <Form className="d-flex flex-wrap" onSubmit={handleSubmit(startCheckout)}>
                        <Row>
                            <Col lg={4} md={4}>
                                <SectionCartCheckout dataCart={cart} />
                            </Col>
                            <Col lg={4} md={4}>
                                <InputsCheckout registerForm={register} errorsForm={errors} />
                            </Col>
                            <Col lg={4} md={4}>
                                <SectionConfirmCheckout summary={cartSummary} onDelete={handleDeleteCart} />
                            </Col>
                        </Row>
                    </Form>
                </Container>
            }
        </>
    )
}

export default CheckoutContainer;