import { Card, Flex, List, Rate, Spin, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getReviews } from '../api/reviews';
import { getProfessionals } from '../api/professional';

const { Title, Text } = Typography;

export default function Review() {
  const { id } = useParams();
  const [reviews, setReviews] = useState([]);
  const [average, setAverage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [prof, setProf] = useState('')

  const loadReviews = () => {
    getReviews(id)
      .then((res) => {
        console.log(res)
        const { data } = res
        const avg = data.reduce((acc, val) => acc + val.score, 0) / data.length
        setAverage(avg)
        setReviews(data)
      })
      .catch(console.error)
  }

  useEffect(() => {
    loadReviews()
    setLoading(false)
  }, [id]);

  useEffect(() => {
    getProfessionals()
      .then((res) => {
        console.log(res);
        setProf(res.data.find(p => p.id == id).name)
      })
  }, [])

  if (loading) {
    return (
      <div style={{ display: 'grid', placeItems: 'center', minHeight: '60vh' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <Card>
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <Title level={3}>
          Opiniones del profesional: {prof}
        </Title>

        <Rate allowHalf disabled value={average} />
        <Text style={{ marginLeft: 8 }}>
          {average}/5 ({reviews.length} reseñas)
        </Text>
      </div>

      <List
        itemLayout="vertical"
        dataSource={reviews}
        locale={{ emptyText: 'Aún no hay comentarios.' }}
        renderItem={(item) => (
          <List.Item style={{ paddingInline: 0 }}>
            <Flex align='center'>
              <div>
                <Text strong>{item.author}</Text>{' '}
                <Text type="secondary">
                  {new Date(item.review_date).toLocaleDateString()}
                </Text>
                <p style={{ marginTop: 8 }}>{item.comment}</p>
              </div>
              <Rate disabled value={item.score} style={{ marginLeft: 'auto' }} />
            </Flex>
          </List.Item>
        )}
      />
    </Card>
  );
}
