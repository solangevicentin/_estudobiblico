import React, { useState, useEffect } from 'react';
import api from './api';
import Header from './header';
import { 
    Container, 
    Table, 
    TableRow, 
    TableHead,
    TableBody,
    TableCell,  
    Dialog, 
    Button, 
    DialogTitle, 
    DialogContent,
    DialogContentText, 
    TextField,
    DialogActions } from '@material-ui/core';
import './style.css';


function App() {

    const [ lista, setLista ] = useState([]);
    const [ open, setOpen ] = useState(false);
    const [ livros, setLivros] = useState('');
    const [ capitulo, setCapitulo] = useState('');
    const [ versiculo, setVersiculo] = useState('');

    function loadData() {
        api.get('/livro').then((response) => {
            const itens = response.data;
            setLista(itens);
        })
    }

    useEffect(() => loadData(), []);

    const openModal = () => setOpen(true);

    const closeModal = () => setOpen(false);

    //Função para adicionar um novo livro
    function addLivro() { 
        const books = livros;
        const chapter = capitulo;
        const verse = versiculo;
        api.post('/livro', { livros: books, capitulo: chapter, versiculo: verse }).then((response) => {
        setLivros('');
        setCapitulo('');
        setVersiculo('');
        setOpen(false);
        loadData()
        })
     }

     //Função para marcar um livro como 'Não lido'
    function markAsLido(id, lido) {
        if(lido === true){
            api.patch(`/livro/${id}/naolido`).then((response) => {
                loadData()
            });
        } else {
                api.patch(`/livro/${id}/lido`).then((response) => {
                loadData()
            });
        }
    }


    //Função para excluir um livro da lista.
     function deleteLivro(id) {
         api.delete(`/livro/${id}`).then((response) => {
            loadData()
         })
     }


    return (
        <>
        <Header />
        <Container maxWidth="lg" className="container">
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell>livros</TableCell>
                        <TableCell>capitulo</TableCell>
                        <TableCell>versiculo</TableCell>
                        <TableCell>lido?</TableCell>
                        <TableCell>Apagar</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {lista.map(item => (
                        <TableRow key={item.id}>
                            <TableCell>{item.id}</TableCell>
                            <TableCell>{item.livros}</TableCell>
                            <TableCell>{item.capitulo}</TableCell>
                            <TableCell>{item.versiculo}</TableCell>
                            <TableCell>
                                <input type="checkbox" 
                                onChange={() => markAsLido(item.id, item.lido)}                   
                                checked={item.lido === true ? true : false}/>
                            </TableCell>
                            <TableCell>
                                <Button variant="outlined" size="small" color="secondary" onClick={() => deleteLivro(item.id)} >Apagar</Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <Button 
                onClick={openModal}
                variant="contained" 
                color="primary" 
                style={{marginTop: '20px'}}>
                Adicionar
            </Button>
            </Container>
            <Dialog open={open} onClose={closeModal} fullWidth={true} maxWidth="sm">
                <DialogTitle id="form-dialog-title">Novo Livro</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Digite o livro que deseja adicionar.
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="livros"
                        label="livros"
                        type="text"
                        fullWidth
                        value={livros}
                        onChange={e => setLivros(e.target.value)}
                    />
                    <TextField
                        margin="dense"
                        id="capitulo"
                        label="Capitulo"
                        type="number"
                        fullWidth
                        value={capitulo}
                        onChange={e => setCapitulo(e.target.value)}
                    />
                    <TextField
                        margin="dense"
                        id="versiculo"
                        label="Versiculo"
                        type="number"
                        fullWidth
                        value={versiculo}
                        onChange={e => setVersiculo(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeModal} color="primary">
                        Cancelar
                    </Button>
                    <Button onClick={addLivro} color="primary">
                        Salvar
                    </Button>
                 </DialogActions>
            </Dialog>
        </>
    );

}

export default App;
