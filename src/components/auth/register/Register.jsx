import { Button, Card, Col, Form, FormGroup, Row, InputGroup } from "react-bootstrap";
import { useState } from 'react'
import { useRef } from 'react'
import { useNavigate } from "react-router";
import { errorToast, successToast } from "../../notifications/Notifications";
import { validateEmail, validatePassword, registerUser, validateString } from "../auth.services";
import { FaEye, FaEyeSlash } from 'react-icons/fa'

const Register = () => {
    const navigate = useNavigate()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [checkPassword, setCheckPassword] = useState('')
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')


    const emailRef = useRef(null)
    const checkPasswordRef = useRef(null)
    const passwordRef = useRef(null)
    const firstNameRef = useRef(null)
    const lastNameRef = useRef(null)

    const [errors, setErrors] = useState({email: false, password: false, checkPassword: false, firstName: false, lastName: false})

    const [showPassword, setShowPassword] = useState(null)

    const handleEmail = (e) => {
        setEmail(e.target.value)
        setErrors({...errors, email: false})
    }
    const handlePassword = (e) => {
        setPassword(e.target.value)
        setErrors({...errors, password: false})
    }
        const handleCheckPassword = (e) => {
        setCheckPassword(e.target.value)
        setErrors({...errors, checkPassword: false})
    }
    const handleFirstName = (e) => {
        setFirstName(e.target.value)
        setErrors({...errors, firstName: false})
    }
    const handleLastName = (e) => {
        setLastName(e.target.value)
        setErrors({...errors, lastName: false})
    }
    
    const handleShowPassword = () => {
        if (showPassword)
            setShowPassword(null)
        else
            setShowPassword(true)
    }

    // Navigate Login

    const handleNavLogin = () => {
        navigate('/login')
    }


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
            errorToast('Ingresá una contraseña.')
            setErrors({...errors, password: true})
            passwordRef.current.focus()
            return
        }

        if (!validatePassword(password, 7, null, true, true)) {
            errorToast('La contraseña debe tener al menos 7 caracteres, una mayúscula y un número.')
            setErrors({...errors, password: true})
            passwordRef.current.focus()
            return
        }

        else if (!checkPassword.length) {
            errorToast('Repetí la contraseña.')
            setErrors({...errors, checkPassword:true})
            checkPasswordRef.current.focus()
            return
        }

        else if (password !== checkPassword) {
            errorToast('Las contraseñas no coinciden')
            setErrors({...errors, checkPassword:true})
            checkPasswordRef.current.focus()
            return
        }

        else if (!firstName.length || !validateString(firstName, 1, 50)) {
            errorToast('Ingresá un nombre de hasta 50 caracteres.')
            setErrors({...errors, firstName: true})
            firstNameRef.current.focus()
            return
        }

        else if (!lastName.length || !validateString(lastName, 1, 50)) {
            errorToast('Ingresá un apellido de hasta 50 caracteres.')
            setErrors({...errors, lastName: true})
            lastNameRef.current.focus()
            return
        }

        setErrors({email: false, checkPassword: false, password: false, firstName: false, lastName: false})


        // Envio a Backend
        const newUser = {
            email,
            password,
            firstName,
            lastName
        }

        registerUser(newUser, 
            () => {
                successToast(`¡Bienvenido, ${newUser.firstName}`)
                handleNavLogin()
            },
            err => errorToast(err.message)
        );

        
    }


    return (
        <main className="login-page">
        <Card className="login-card p-3 px-5 shadow border-0">
            <Card.Body>
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
                    <FormGroup className="mb-4">
                        <InputGroup>
                            <Form.Control
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Repetir contraseña"
                                value={checkPassword}
                                onChange={handleCheckPassword}
                                ref={checkPasswordRef}
                                className={errors.checkPassword && 'border border-danger'}
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
                        {!errors.checkPassword
                        ?''
                        :<div>Las contraseñas no coinciden</div>}
                    </FormGroup>
                    <FormGroup className="mb-4">
                        <Form.Control
                            type="text"
                            placeholder="Ingresar nombre"
                            value={firstName}
                            className={errors.firstName && 'border border-danger'} 
                            onChange={handleFirstName}
                            ref={firstNameRef}
                        />
                        {!errors.firstName
                        ?''
                        :<div>Por favor, completa el campo 'Nombre'</div>}
                    </FormGroup>
                    <FormGroup className="mb-4">
                        <Form.Control
                            type="text"
                            placeholder="Ingresar Apellido"
                            value={lastName}
                            className={errors.lastName && 'border border-danger'} 
                            onChange={handleLastName}
                            ref={lastNameRef}
                        />
                        {!errors.lastName
                        ?''
                        :<div>Por favor, completa el campo 'Apellido'</div>}
                    </FormGroup>
                    <Row>
                        <Col />
                        <Col md={6} className="d-flex justify-content-end">
                            <Button variant="secondary" type="submit">
                                Registrarse
                            </Button>
                        </Col>
                    </Row>
                </Form>
                <hr className="my-4" />
                <p className="text-center mb-0">
                    ¿Ya tenés cuenta?{' '}
                    <Button variant="link" className="p-0 align-baseline" onClick={handleNavLogin}>
                        Inicia Sesion
                    </Button>
                </p>
            </Card.Body>
        </Card>
        </main>
    );
}



export default Register
