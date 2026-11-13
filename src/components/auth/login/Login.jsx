import { Button, Card, Col, Form, FormGroup, Row, InputGroup } from "react-bootstrap";
import { useState } from 'react'
import { useRef } from 'react'
import { useNavigate } from "react-router";
import { useContext } from "react";
import { AuthenticationContext } from "../../services/auth.context";
import { errorToast, successToast } from "../../notifications/Notifications";
import { validateEmail, loginUser } from "../auth.services";
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import logo from '../../../assets/images/ph-completo-fondo-blanco.png'

const Login = () => {
    const navigate = useNavigate()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const emailRef = useRef(null)
    const passwordRef = useRef(null)

    const [errors, setErrors] = useState({email: false, password: false})

    const [showPassword, setShowPassword] = useState(null)

    const handleEmail = (e) => {
        setEmail(e.target.value)
        setErrors({...errors, email: false})
    }

    const handlePassword = (e) => {
        setPassword(e.target.value)
        setErrors({...errors, password: false})
    }

    const handleShowPassword = () => {
        if (showPassword)
            setShowPassword(null)
        else
            setShowPassword(true)
    }

    const { handleUserLogin } = useContext(AuthenticationContext)

    const handleSubmit = (e) => {
        e.preventDefault()

        if (!email.trim()) {
            errorToast('Ingresá tu email.')
            setErrors({...errors, email: true})
            emailRef.current.focus()
            return
        }

        if (!validateEmail(email)) {
            errorToast('Ingresá una dirección de email válida.')
            setErrors({...errors, email: true})
            emailRef.current.focus()
            return
        }

        if (!password.length) {
            errorToast('Ingresá tu contraseña.')
            setErrors({...errors, password: true})
            passwordRef.current.focus()
            return
        }

        setErrors({email: false, password: false})


        // Fecth a Backend

        loginUser(email, password, 
            token => {
                handleUserLogin(token)
                successToast('¡Bienvenido/a de nuevo!')
                navigate('/home')
            },
            err => errorToast(err.message)
        )
    }

    // Nav a Registro

    const handleNavRegister = () => {
        navigate('/register')
    }


    return (
        <main className="login-page">
        <Card className="login-card p-3 px-5 shadow border-0">
            <Card.Body>
                <img src={logo} 
                alt="Logo Point Hardware"
                width={220}
                height={140}
                className="d-block mx-auto"
                />
                <Row className="mb-2">
                    <h5 className="login-title">¡Bienvenido a Point Hardware!</h5>
                </Row>
                <Form onSubmit={handleSubmit}>
                    <FormGroup className="mb-4">
                        <Form.Control
                            type="email"
                            placeholder="Ingresar email"
                            value={email}
                            className={errors.email && 'border border-danger'} 
                            onChange={handleEmail}
                            ref={emailRef}
                        />
                        {!errors.email
                        ?''
                        :<div>Por favor, completa el campo 'email'</div>}
                    </FormGroup>
                    <FormGroup className="mb-4">
                        <InputGroup>
                            <Form.Control
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Ingresar contraseña"
                                value={password}
                                onChange={handlePassword}
                                ref={passwordRef}
                                className={errors.password && 'border border-danger'}
                            />
                            <Button
                                variant="outline-secondary"
                                type="button"
                                onClick={handleShowPassword}
                                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </Button>
                        </InputGroup>
                        {!errors.password
                        ?''
                        :<div>Por favor, completa el campo 'contraseña'</div>}
                    </FormGroup>
                    <Row>
                        <Col />
                        <Col md={6} className="d-flex justify-content-end">
                            <Button variant="secondary" type="submit">
                                Iniciar sesión
                            </Button>
                        </Col>
                    </Row>
                </Form>
                <hr className="my-4" />
                <p className="text-center mb-0">
                    ¿No tenés cuenta?{' '}
                    <Button variant="link" className="p-0 align-baseline" onClick={handleNavRegister}>
                        Registrate
                    </Button>
                </p>
            </Card.Body>
        </Card>
        </main>
    );
}



export default Login
