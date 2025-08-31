import { useEffect, useState } from 'react'
import { getProductos } from '../mocks/AsyncMock'
import ItemList from './ItemList'
import { Container } from 'react-bootstrap';
import { useParams } from 'react-router-dom'
import Loader from './Loader';

const ItemListContainer = () => {
    const { category } = useParams();
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true);
    let resFilter = [];

    useEffect(() => {
        getProductos()
            .then((res) => {
                if (category) {
                    if (category === "Oferta") {
                        resFilter = res.filter((item) => item.oferta == true)
                    } else {
                        resFilter = res.filter((item) => item.categoria === category)
                    }
                    setData(resFilter);
                } else {
                    setData(res)
                }
            })
            .catch((error) => { console.error(error) })
            .finally(() => {
                setLoading(false)
                console.log("Finalizó el proceso de carga");
            });
    }, [category])

    return (
        <Container>
            {loading ? <Loader/> : ''}
            <ItemList dataItemList={data} />
        </Container>
    )
}

export default ItemListContainer;