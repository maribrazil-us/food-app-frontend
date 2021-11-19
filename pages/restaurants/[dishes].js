import { useQuery, gql } from "@apollo/client";
import { useRouter } from "next/router";
import RestaurantList from "../../components/restaurantList";
import AppContext from "../../components/context";
import Cart from "../../components/cart";

import {
  Button,
  Card,
  CardBody,
  CardImg,
  CardText,
  CardTitle,
  Col,
  Row,
} from "reactstrap";
import { useContext } from "react";

const GET_RESTAURANT_DISHES = gql`
  query($id: ID!) {
    restaurant (id: $id) {
      id
      name
      dishes {
        name
        description
        price
        id
        image {
          url
        }
      }
    }
  }
`;

const RestaurantDishes = () => {
  const appContext = useContext(AppContext);
  const router = useRouter();
  const { data, loading, error } = useQuery(GET_RESTAURANT_DISHES, {
    variables: { id: router.query.dishes},
  });

  if (error) return "Error Loading dishes";

  if (loading) return <h1>Loading ...</h1>;

  if (data) {
    const { restaurant } = data;

    return (
      <>
        <h1>{restaurant.name}</h1>

        <Row>
          {restaurant.dishes.map((res) => (
            <Col xs="6" sm="4" style={{ padding: 0 }} key={res.id}>
              <Card style={{ margin: "0 10px" }}>
                
                    <CardImg
                     
                      top={true}
                      style={{ height: 250 }}
                      src={
                    process.env.NODE_ENV === "production"
                      ? res.image.url
                      : `${process.env.NEXT_PUBLIC_API_URL}${res.image.url}`
                  }
                    />
                  
                <CardBody>
                  <CardTitle>{res.name}</CardTitle>
                  <CardText>{res.description}</CardText>
                  <CardText>${res.price}</CardText>
                </CardBody>

                <div className="card-footer">
                  <Button outline color="primary" onClick={() => appContext.addItem(res)}>
                    + Add To Cart
                  </Button>

                  <style jsx>
                    {`
                      a {
                        color: white;
                      }

                      a:link {
                        text-decoration: none;

                        color: white;
                      }

                      .container-fluid {
                        margin-bottom: 30px;
                      }

                      .btn-outline-primary {
                        color: #007bff !important;
                      }

                      a:hover {
                        color: white !important;
                      }
                    `}
                  </style>
                </div>
              </Card>
            </Col>
          ))}
          <Col xs="3" style={{ padding: 0 }}>
          <div>
              <Cart />
            </div>
          </Col>
        </Row>
      </>
    );
  }
};

export default RestaurantDishes;