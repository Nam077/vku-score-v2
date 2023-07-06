import React, { FunctionComponent, useEffect } from 'react';
import { colorType, getAllHighScoreThanCurrent } from './TableScore.tsx';
import { Col, Select, Skeleton, Table, Tabs, Tag, Typography } from 'antd';
import { IScore } from '../pages/score/Score.tsx';
import { ColumnsType } from 'antd/es/table';
import { RecommendHocPhan } from '../services/recomend.service.ts';
const validateRecommendHocPhan = (recommendHocPhan: RecommendHocPhan[]): RecommendHocPhan[] => {
    const result: RecommendHocPhan[] = [];
    recommendHocPhan.forEach((recommend, index) => {
        if (recommend.scorePredict > 10) {
            recommend.scorePredict = 10;
        }
        if (parseFloat(recommend.difference.toFixed(3)) > 0) {
            recommend.key = index + 1;
            result.push(recommend);
        }
    });
    return result;
};
export interface Recommend {
    id: number;
    value: string;
    key?: number | null;
    name: string;
    sumScoreCh: string;
    countTch: number;
    tags: string[];
    difference: number;
}

interface OwnProps {
    recommends: Recommend[];
    recommendHocPhan: RecommendHocPhan[];
    scoreModified: IScore[];
    changeModified: (score: IScore) => void;
}

type Props = OwnProps;
const getElementById = (id: number, recommends: IScore[]) => {
    return recommends.find((recommend) => recommend.id === id);
};
const TableRecommend: FunctionComponent<Props> = (props) => {
    const [isLoading, setIsLoading] = React.useState(false);
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1000);

        return () => clearTimeout(timer);
    }, []);
    const filteredRecommends = props.recommends.filter((recommend) => recommend.difference > 0);
    const filteredRecommendsWithKey = filteredRecommends.map((recommend, index) => ({
        ...recommend,
        key: index + 1,
    }));
    // lọc các difrence > 0 và nếu scorePredict > 10 thì đưa giá trị về 10
    const filteredRecommendsHocPhan: RecommendHocPhan[] = validateRecommendHocPhan(props.recommendHocPhan);

    const columns: ColumnsType<RecommendHocPhan> = [
        {
            title: 'STT',
            key: 'stt',
            dataIndex: 'id',
        },
        {
            title: 'Học phần',
            key: 'name',
            dataIndex: 'name',
        },
        {
            title: 'Số tín chỉ',
            key: 'countTC',
            dataIndex: 'countTC',
        },
        {
            title: 'Điểm Chữ',
            key: 'scoreCh',
            dataIndex: 'scoreCh',
            render: (scoreCh) => (
                <Col flex={1} style={{ textAlign: 'center' }}>
                    <Tag
                        color={colorType[scoreCh]}
                        style={{ marginTop: '5px', textAlign: 'center', fontStyle: 'bold' }}
                    >
                        {scoreCh}
                    </Tag>
                </Col>
            ),
        },
        {
            title: 'Điểm hiện tại',
            key: 'scoreT10',
            dataIndex: 'scoreT10',
            render: (scoreT10, record) => (
                <Col flex={1} style={{ textAlign: 'center' }}>
                    <Tag
                        color={scoreT10 > record.scorePredict ? colorType['A'] : colorType['F']}
                        style={{ marginTop: '5px', textAlign: 'center', fontStyle: 'bold' }}
                    >
                        {scoreT10}
                    </Tag>
                </Col>
            ),
        },
        {
            title: 'Điểm dự đoán',
            key: 'scorePredict',
            dataIndex: 'scorePredict',
            render: (scorePredict) => (
                <Col flex={1} style={{ textAlign: 'center' }}>
                    <Tag
                        color={scorePredict > 5 ? colorType['A'] : colorType['F']}
                        style={{ marginTop: '5px', textAlign: 'center', fontStyle: 'bold' }}
                    >
                        {scorePredict.toFixed(3)}
                    </Tag>
                </Col>
            ),
        },
        // độ chênh lệch
        // {
        //     title: 'Độ chênh lệch',
        //     key: 'difference',
        //     dataIndex: 'difference',
        //     render: (difference) => (
        //         <Col flex={1} style={{ textAlign: 'center' }}>
        //             <Tag style={{ marginTop: '5px', textAlign: 'center', fontStyle: 'bold' }}>
        //                 {difference.toFixed(3)}
        //             </Tag>
        //         </Col>
        //     ),
        // },
        {
            title: 'Thay đổi',
            key: 'action',
            dataIndex: 'scoreCh',
            render: (scoreCh, record) => {
                const score = getElementById(record.id, props.scoreModified) as IScore;
                const isChanged = score?.scoreCh !== scoreCh;
                return (
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            minWidth: '165px',
                            maxWidth: '165px',
                            minHeight: '59px',
                        }}
                    >
                        <Select
                            // defaultValue={score?.scoreCh}
                            style={{ fontWeight: 'bold' }}
                            disabled={scoreCh === 'A'}
                            value={score?.scoreCh}
                            options={getAllHighScoreThanCurrent(scoreCh)}
                            onChange={(value) => {
                                const modifiedScore = { ...score, scoreCh: value };
                                props.changeModified(modifiedScore);
                            }}
                        />
                        {isChanged && (
                            <Tag color={colorType['A']} style={{ marginTop: '5px', width: '100%' }}>
                                {scoreCh === '' ? 'Chưa có điểm.' : `Điểm trước khi cải thiện ${scoreCh}.`}
                            </Tag>
                        )}
                    </div>
                );
            },
        },
    ];
    // interface RecommendHocPhan {
    //     id: number;
    //     name: string;
    //     scorePredict: number;
    //     scoreT10: number | string | null;
    //     difference: number;
    //     scoreCh: number | string | null;
    //     countTC: number | string | null;
    // }
    const columns2: ColumnsType<RecommendHocPhan> = [
        {
            title: 'STT',
            key: 'stt',
            dataIndex: 'id',
        },
        {
            title: 'Học phần',
            key: 'name',
            dataIndex: 'name',
        },
        {
            title: 'Số tín chỉ',
            key: 'countTC',
            dataIndex: 'countTC',
        },
        {
            title: 'Điểm hiện tại',
            key: 'scoreT10',
            dataIndex: 'scoreT10',
            render: (scoreT10, record) => (
                <Col flex={1} style={{ textAlign: 'center' }}>
                    <Tag
                        color={scoreT10 > record.scorePredict ? colorType['A'] : colorType['F']}
                        style={{ marginTop: '5px', textAlign: 'center', fontStyle: 'bold' }}
                    >
                        {scoreT10}
                    </Tag>
                </Col>
            ),
        },
        {
            title: 'Điểm dự đoán',
            key: 'scorePredict',
            dataIndex: 'scorePredict',
            render: (scorePredict) => (
                <Col flex={1} style={{ textAlign: 'center' }}>
                    <Tag
                        color={scorePredict > 5 ? colorType['A'] : colorType['F']}
                        style={{ marginTop: '5px', textAlign: 'center', fontStyle: 'bold' }}
                    >
                        {scorePredict.toFixed(3)}
                    </Tag>
                </Col>
            ),
        },
        // độ chênh lệch
        {
            title: 'Độ chênh lệch',
            key: 'difference',
            dataIndex: 'difference',
            render: (difference) => (
                <Col flex={1} style={{ textAlign: 'center' }}>
                    <Tag
                        color={difference > 0 ? colorType['A'] : colorType['F']}
                        style={{ marginTop: '5px', textAlign: 'center', fontStyle: 'bold' }}
                    >
                        {difference.toFixed(3)}
                    </Tag>
                </Col>
            ),
        },
        {
            title: 'Điểm Chữ',
            key: 'scoreCh',
            dataIndex: 'scoreCh',
            render: (scoreCh) => (
                <Col flex={1} style={{ textAlign: 'center' }}>
                    <Tag
                        color={colorType[scoreCh]}
                        style={{ marginTop: '5px', textAlign: 'center', fontStyle: 'bold' }}
                    >
                        {scoreCh}
                    </Tag>
                </Col>
            ),
        },
    ];
    return (
        <div>
            {isLoading ? (
                <Skeleton />
            ) : (
                <div>
                    <Typography.Text type="success" style={{ marginBottom: '10px' }}>
                        Chúng tôi đã phân tích thế mạnh của bạn. Bạn nên ưu tiên học cải thiện những môn dưới đây, theo
                        thứ tự ưu tiên trừ trên xuống.
                    </Typography.Text>
                    <Table
                        columns={columns}
                        dataSource={filteredRecommendsHocPhan}
                        pagination={false}
                        style={{
                            fontWeight: 'bold',
                            marginTop: '10px',
                        }}
                    />
                </div>
            )}
        </div>
    );
};
export default TableRecommend;
